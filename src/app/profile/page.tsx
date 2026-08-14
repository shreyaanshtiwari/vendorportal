"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, User, Phone, Mail, MapPin, Briefcase, ShieldCheck, Clock, Camera } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import '../../styles/dashboard.css';

import { Skeleton } from '../../components/ui/Skeleton';
import {
  unwrapProfile,
  getShopName,
  getContactPersonName,
  mergeVendorProfile,
  loadStoredVendorProfile,
} from '../../lib/profile';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchApi('/vendor/profile');
        setProfile(mergeVendorProfile(unwrapProfile(data), loadStoredVendorProfile()));
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
        <Skeleton width="100%" height="240px" borderRadius="24px 24px 0 0" />
        <div className="profile-header-container">
          <div className="profile-header-info">
            <div style={{ borderRadius: '50%', border: '4px solid white', overflow: 'hidden', background: 'white' }}>
              <Skeleton width="140px" height="140px" borderRadius="50%" />
            </div>
            <div style={{ paddingBottom: '12px' }}>
              <Skeleton width="200px" height="32px" style={{ marginBottom: '8px' }} />
              <div style={{ display: 'flex', gap: '16px' }}>
                <Skeleton width="120px" height="20px" />
                <Skeleton width="80px" height="20px" borderRadius="12px" />
              </div>
            </div>
          </div>
          <div style={{ paddingBottom: '12px' }}>
            <Skeleton width="140px" height="40px" borderRadius="12px" />
          </div>
        </div>
        <div className="profile-grid" style={{ padding: '0 16px' }}>
          <div className="royal-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Skeleton width="180px" height="24px" />
            <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <Skeleton width="100px" height="16px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="100%" height="48px" borderRadius="12px" />
                </div>
              ))}
            </div>
          </div>
          <div className="royal-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Skeleton width="180px" height="24px" />
            <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3].map(i => (
                <div key={i}>
                  <Skeleton width="100px" height="16px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="100%" height="48px" borderRadius="12px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', margin: '20px' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      
      {/* Cover Banner */}
      <div style={{ 
        width: '100%', 
        height: '240px', 
        position: 'relative', 
        borderRadius: '24px 24px 0 0',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, var(--royal-maroon) 0%, #3B4623 100%)',
          opacity: 0.9
        }} />
        <Image src="/images/besan_ladoo.png" alt="Cover Image" fill style={{ objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.4 }} />
        
        <button style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: '12px',
          padding: '8px 16px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <Camera size={16} /> Edit Cover
        </button>
      </div>

      {/* Floating Profile Header */}
      <div className="profile-header-container">
        <div className="profile-header-info">
          <div className="profile-avatar" style={{
            borderRadius: '50%', 
            border: '4px solid var(--royal-cream)', 
            overflow: 'hidden', 
            position: 'relative',
            background: 'white',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}>
            <Image src={profile?.avatarUrl || "/images/store_logo.png"} alt="Store Logo" fill style={{ objectFit: 'cover' }} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.5)',
              padding: '6px',
              display: 'flex',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Camera size={16} color="white" />
            </div>
          </div>

          <div style={{ paddingBottom: '12px' }}>
            <h1 className="profile-title" style={{ margin: '0 0 4px', fontWeight: 800, color: 'var(--royal-text-dark)' }}>{getShopName(profile) || 'Store'}</h1>
            <div className="profile-stats">
              <span style={{ fontSize: '14px', color: 'var(--royal-text-gray)', fontWeight: 500 }}>Vendor ID: <strong style={{ color: 'var(--royal-text-dark)' }}>VOR12345</strong></span>
              <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                ⭐ 4.8 Rating
              </span>
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: '12px' }}>
          <Link href="/profile/edit" style={{ 
            background: 'var(--royal-maroon)', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            fontSize: '14px', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(139, 29, 65, 0.2)'
          }}>
            <Pencil size={16} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="profile-grid" style={{ padding: '0 16px' }}>
        
        {/* Left Column: Basic Info */}
        <div className="royal-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--royal-text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="var(--royal-maroon)" /> Basic Information
          </h3>
          <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: 0 }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Store Name</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                <span style={{ flex: 1, fontSize: '15px', color: 'var(--royal-text-dark)', fontWeight: 500 }}>{getShopName(profile) || '-'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Contact Person</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                <User size={18} color="var(--royal-text-gray)" style={{ marginRight: '12px' }} />
                <span style={{ flex: 1, fontSize: '15px', color: 'var(--royal-text-dark)', fontWeight: 500 }}>{getContactPersonName(profile) || '-'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Phone Number</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                <Phone size={18} color="var(--royal-text-gray)" style={{ marginRight: '12px' }} />
                <span style={{ flex: 1, fontSize: '15px', color: 'var(--royal-text-dark)', fontWeight: 500 }}>{profile?.phone || '-'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                <Mail size={18} color="var(--royal-text-gray)" style={{ marginRight: '12px' }} />
                <span style={{ flex: 1, fontSize: '15px', color: 'var(--royal-text-dark)', fontWeight: 500 }}>{profile?.email || '-'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Business Details */}
        <div className="royal-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--royal-text-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} color="var(--royal-maroon)" /> Business Details
          </h3>
          <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: 0 }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Registered Address</label>
              <div style={{ display: 'flex', alignItems: 'flex-start', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                <MapPin size={18} color="var(--royal-text-gray)" style={{ marginRight: '12px', marginTop: '2px' }} />
                <span style={{ flex: 1, fontSize: '15px', color: 'var(--royal-text-dark)', fontWeight: 500, lineHeight: 1.5 }}>
                  {profile?.address || '-'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>GSTIN</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                  <Briefcase size={18} color="var(--royal-text-gray)" style={{ marginRight: '8px' }} />
                  <span style={{ flex: 1, fontSize: '14px', color: 'var(--royal-text-dark)', fontWeight: 500 }}>{profile?.panGst || '-'}</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>FSSAI License</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                  <ShieldCheck size={18} color="var(--royal-text-gray)" style={{ marginRight: '8px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Operating Hours</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--royal-border)' }}>
                <Clock size={18} color="var(--royal-text-gray)" style={{ marginRight: '12px' }} />
                <span style={{ flex: 1, fontSize: '15px', color: 'var(--royal-text-dark)', fontWeight: 500 }}>{profile?.operatingHours || '09:00 AM - 09:00 PM (Mon - Sat)'}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
