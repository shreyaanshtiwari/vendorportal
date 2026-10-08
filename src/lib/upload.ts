import { supabase } from './supabase';
import { fetchApi } from './api';
import { persistVendorProfilePatch } from './profile';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads a vendor avatar or cover banner image to Supabase 'avatars' storage bucket
 * and synchronizes the public URL with both Supabase database and backend API.
 */
export async function uploadVendorImage({
  file,
  type = 'avatar',
  vendorId,
}: {
  file: File;
  type?: 'avatar' | 'cover';
  vendorId?: string;
}): Promise<UploadResult> {
  try {
    if (!file) {
      return { success: false, error: 'No file selected.' };
    }

    // 1. File size validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Image size must be less than 10MB.' };
    }

    // 2. MIME type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return { success: false, error: 'Supported formats: JPG, PNG, WebP, and GIF.' };
    }

    // 3. Resolve vendor ID
    const resolvedVendorId =
      vendorId ||
      (typeof window !== 'undefined' ? localStorage.getItem('swaddesh_vendor_id') : null) ||
      'vendor';

    const ext = file.name.split('.').pop() || 'png';
    const fileName = `${type}-${resolvedVendorId}-${Date.now()}.${ext}`;
    const filePath = `vendors/${resolvedVendorId}/${fileName}`;

    // 4. Upload to Supabase 'avatars' storage bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[Upload Error] Supabase storage upload failed:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // 5. Retrieve public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 6. Direct update in Supabase 'vendors' table (Immediate & resilient)
    if (resolvedVendorId && resolvedVendorId !== 'vendor') {
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (type === 'avatar') {
        dbUpdates.logo_url = publicUrl;
      } else {
        dbUpdates.banner_url = publicUrl;
      }

      const { error: dbError } = await supabase
        .from('vendors')
        .update(dbUpdates)
        .eq('id', resolvedVendorId);

      if (dbError) {
        console.warn('[DB Note] Direct Supabase vendors update warning:', dbError);
      }
    }

    // 7. Update current authenticated user profile avatar if available
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id && type === 'avatar') {
        await supabase
          .from('profiles')
          .update({
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.user.id);
      }
    } catch (e) {
      console.warn('[DB Note] profiles sync warning:', e);
    }

    // 8. Synchronize with backend API (/vendor/profile)
    try {
      const apiPayload =
        type === 'avatar'
          ? {
              avatarUrl: publicUrl,
              logoUrl: publicUrl,
              logo_url: publicUrl,
              avatar_url: publicUrl,
            }
          : {
              bannerUrl: publicUrl,
              banner_url: publicUrl,
              coverUrl: publicUrl,
            };

      await fetchApi('/vendor/profile', {
        method: 'PUT',
        body: JSON.stringify(apiPayload),
      });
    } catch (apiErr) {
      console.warn('[API Note] Backend profile PUT sync note:', apiErr);
    }

    // 9. Persist update in local storage for instant UI persistence
    const patch =
      type === 'avatar'
        ? {
            avatarUrl: publicUrl,
            logo_url: publicUrl,
            logoUrl: publicUrl,
            avatar_url: publicUrl,
          }
        : {
            bannerUrl: publicUrl,
            banner_url: publicUrl,
            coverUrl: publicUrl,
          };

    persistVendorProfilePatch(patch);

    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error('[Upload Exception]:', err);
    return { success: false, error: err.message || 'Failed to upload photo.' };
  }
}
