import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgksnbfhmbwozuadqouf.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getAdminClient() {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Self-healing vendor authentication recovery endpoint.
 * When a vendor signs in with valid credentials but Supabase Auth rejects
 * because the user was not yet created in auth.users or email domain typo occurred,
 * this endpoint resolves the vendor record, creates/updates the auth user,
 * ensures vendor_members mapping, and returns the authoritative credentials.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!rawEmail) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase();
    const supabaseAdmin = getAdminClient();

    // Check email variations (handle common typos like @gmmail.com <-> @gmail.com)
    let altEmail = email;
    if (email.endsWith('@gmmail.com')) {
      altEmail = email.replace('@gmmail.com', '@gmail.com');
    } else if (email.endsWith('@gmail.com')) {
      altEmail = email.replace('@gmail.com', '@gmmail.com');
    }

    // 1. Look up vendor in public.vendors
    const { data: vendors, error: vErr } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .or(`primary_email.ilike.${email},primary_email.ilike.${altEmail}`)
      .limit(1);

    if (vErr || !vendors || vendors.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No vendor store found registered with this email address.' },
        { status: 404 }
      );
    }

    const vendor = vendors[0];

    // 2. Enforce vendor approval status
    if (vendor.status === 'PENDING') {
      return NextResponse.json({
        success: false,
        status: 'PENDING',
        error: 'Your store registration is currently pending admin approval. You will be able to access the dashboard once approved.',
      });
    }

    if (vendor.status === 'REJECTED') {
      return NextResponse.json({
        success: false,
        status: 'REJECTED',
        error: 'Your vendor account application was rejected. Please contact support.',
      });
    }

    if (vendor.status === 'SUSPENDED') {
      return NextResponse.json({
        success: false,
        status: 'SUSPENDED',
        error: 'Your vendor account has been suspended. Please contact support.',
      });
    }

    // If the registered email had a typo like @gmmail.com and user is logging in with @gmail.com, fix it
    if (vendor.primary_email?.toLowerCase().endsWith('@gmmail.com') && email.endsWith('@gmail.com')) {
      console.log(`[Auth Resolve] Correcting typo in public.vendors primary_email from ${vendor.primary_email} to ${email}`);
      await supabaseAdmin.from('vendors').update({ primary_email: email }).eq('id', vendor.id);
      vendor.primary_email = email;
    }

    const targetEmail = vendor.primary_email ? vendor.primary_email.toLowerCase() : email;

    // 3. Vendor is ACTIVE - Ensure user exists in Supabase auth.users
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) {
      console.error('[Auth Resolve Error] listUsers failed:', listErr);
      return NextResponse.json({ success: false, error: listErr.message }, { status: 500 });
    }

    const allUsers = usersData?.users || [];

    const existingUser = allUsers.find(
      (u) =>
        u.email?.toLowerCase() === targetEmail ||
        u.email?.toLowerCase() === email ||
        u.email?.toLowerCase() === altEmail
    );

    let userId: string;

    if (!existingUser) {
      if (!password) {
        return NextResponse.json(
          { success: false, error: 'Account setup requires password.' },
          { status: 400 }
        );
      }

      console.log(`[Auth Resolve] Creating missing auth.users record for ${targetEmail}`);
      const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: targetEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          role: 'VENDOR',
          full_name: vendor.brand_name || vendor.business_name || 'Vendor Partner',
          phone: vendor.primary_phone || '',
        },
      });

      if (createErr || !newUser?.user) {
        console.error('[Auth Resolve Error] createUser failed:', createErr);
        return NextResponse.json(
          { success: false, error: createErr?.message || 'Failed to create auth account' },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
    } else {
      userId = existingUser.id;
      // Sync password if provided
      if (password) {
        console.log(`[Auth Resolve] Syncing password for existing auth user ${existingUser.email}`);
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: password,
          email_confirm: true,
        });
      }
    }

    // 4. Ensure profile entry exists in public.profiles FIRST (avoids FK constraint issues)
    await supabaseAdmin.from('profiles').upsert({
      id: userId,
      email: targetEmail,
      full_name: vendor.brand_name || vendor.business_name || 'Vendor Partner',
      phone: vendor.primary_phone || '',
      role: 'VENDOR',
      updated_at: new Date().toISOString(),
    });

    // 5. Ensure mapping exists in vendor_members table
    const { data: members } = await supabaseAdmin
      .from('vendor_members')
      .select('id')
      .eq('vendor_id', vendor.id)
      .eq('user_id', userId);

    if (!members || members.length === 0) {
      console.log(`[Auth Resolve] Linking user ${userId} to vendor ${vendor.id} in vendor_members`);
      await supabaseAdmin.from('vendor_members').insert({
        vendor_id: vendor.id,
        user_id: userId,
        member_role: 'OWNER',
      });
    }

    return NextResponse.json({
      success: true,
      resolved: true,
      actualEmail: targetEmail,
      vendorId: vendor.id,
      vendorName: vendor.brand_name || vendor.business_name,
      status: vendor.status,
    });
  } catch (err: any) {
    console.error('[Auth Resolve Exception]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error during auth resolution' },
      { status: 500 }
    );
  }
}
