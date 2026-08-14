"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Phone, Mail, MapPin, Briefcase, Clock, Loader2, Store } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import {
  unwrapProfile,
  getShopName,
  getContactPersonName,
  mergeVendorProfile,
  loadStoredVendorProfile,
  persistVendorProfilePatch,
} from '../../../lib/profile';
import '../../../styles/dashboard.css';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px 14px 44px',
  borderRadius: '12px',
  border: '1px solid var(--royal-border)',
  outline: 'none',
  fontSize: '15px',
  color: 'var(--royal-text-dark)',
  background: 'white',
  fontFamily: 'var(--font-jakarta), sans-serif',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--royal-text-gray)',
};

export default function EditProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    panGst: '',
    operatingHours: '09:00 AM - 09:00 PM (Mon - Sat)',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchApi('/vendor/profile');
        const merged = mergeVendorProfile(unwrapProfile(data), loadStoredVendorProfile());
        setForm({
          shopName: getShopName(merged),
          ownerName: getContactPersonName(merged) || '',
          phone: merged?.phone || '',
          email: merged?.email || '',
          address: merged?.address || '',
          panGst: merged?.panGst || '',
          operatingHours: merged?.operatingHours || '09:00 AM - 09:00 PM (Mon - Sat)',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName.trim()) {
      setError('Store name is required.');
      return;
    }
    if (!form.ownerName.trim()) {
      setError('Contact person name is required.');
      return;
    }

    setIsSaving(true);
    setError('');

    const payload = {
      shopName: form.shopName.trim(),
      storeName: form.shopName.trim(),
      ownerName: form.ownerName.trim(),
      contactPerson: form.ownerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      panGst: form.panGst.trim(),
      operatingHours: form.operatingHours.trim(),
    };

    try {
      try {
        await fetchApi('/vendor/profile', {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } catch {
        await fetchApi('/vendor/profile', {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      }
      persistVendorProfilePatch(payload);
      router.push('/profile');
    } catch (err: any) {
      persistVendorProfilePatch(payload);
      setError(err.message || 'Could not update on server. Changes are saved on this device.');
      setTimeout(() => router.push('/profile'), 1200);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Loader2 size={28} color="var(--royal-maroon)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Edit Profile</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Update your store and contact details</p>
      </div>

      {error && (
        <div style={{ padding: '14px 16px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="royal-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Field label="Store Name" icon={<Store size={18} color="var(--royal-text-gray)" />}>
          <input value={form.shopName} onChange={set('shopName')} required style={inputStyle} />
        </Field>

        <Field label="Contact Person" icon={<User size={18} color="var(--royal-text-gray)" />}>
          <input value={form.ownerName} onChange={set('ownerName')} required placeholder="Full name" style={inputStyle} />
        </Field>

        <Field label="Phone Number" icon={<Phone size={18} color="var(--royal-text-gray)" />}>
          <input value={form.phone} onChange={set('phone')} type="tel" style={inputStyle} />
        </Field>

        <Field label="Email Address" icon={<Mail size={18} color="var(--royal-text-gray)" />}>
          <input value={form.email} onChange={set('email')} type="email" style={inputStyle} />
        </Field>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={labelStyle}>Registered Address</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            <textarea
              value={form.address}
              onChange={set('address')}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>
        </div>

        <Field label="GSTIN" icon={<Briefcase size={18} color="var(--royal-text-gray)" />}>
          <input value={form.panGst} onChange={set('panGst')} style={inputStyle} />
        </Field>

        <Field label="Operating Hours" icon={<Clock size={18} color="var(--royal-text-gray)" />}>
          <input value={form.operatingHours} onChange={set('operatingHours')} style={inputStyle} />
        </Field>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={isSaving}
            style={{
              background: 'var(--royal-maroon)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isSaving ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isSaving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
            Save Changes
          </button>
          <Link
            href="/profile"
            style={{
              background: 'white',
              color: 'var(--royal-text-dark)',
              border: '1px solid var(--royal-border)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Cancel
          </Link>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </form>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
