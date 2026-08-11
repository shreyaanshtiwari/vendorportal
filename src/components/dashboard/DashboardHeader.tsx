'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';

const DashboardHeader = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchApi('/vendor/profile');
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to load profile in header:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const shopName = profile?.shopName || profile?.ownerName || 'My Store';
  const displayId = profile?.email || profile?.phone || 'Vendor Partner';
  const avatarUrl = profile?.avatarUrl || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=140&q=80";

  return (
    <div className="dashboard-header">
      <div className="welcome-text">
        <h1 style={{ color: 'var(--royal-text-dark)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          Namaste, {isLoading ? <Skeleton width="120px" height="32px" borderRadius="6px" /> : (profile?.ownerName || 'Vendor')}! 👏
        </h1>
        <p>Manage your products, orders and grow your business with us.</p>
      </div>
      
      <div className="user-profile">
        <Link href="/notifications" className="notification-bell">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6E5A53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <div className="notification-dot"></div>
        </Link>
        
        <Link href="/profile" className="profile-info" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLoading ? (
            <Skeleton width="48px" height="48px" borderRadius="50%" />
          ) : (
            <img 
              src={avatarUrl} 
              alt={shopName} 
              className="profile-img"
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--royal-gold)' }}
            />
          )}

          <div className="profile-details" style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '100px' }}>
            {isLoading ? (
              <>
                <Skeleton width="110px" height="18px" style={{ marginBottom: '4px' }} />
                <Skeleton width="80px" height="12px" />
              </>
            ) : (
              <>
                <h4 style={{ 
                  margin: 0, 
                  color: '#005662', 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  lineHeight: 1.2,
                  letterSpacing: '-0.2px',
                  fontFamily: 'var(--font-jakarta), sans-serif'
                }}>
                  {shopName}
                </h4>
                <p style={{ margin: 0, color: 'var(--royal-text-gray)', fontSize: '12px', fontWeight: 500 }}>
                  {displayId}
                </p>
              </>
            )}
          </div>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E5A53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
