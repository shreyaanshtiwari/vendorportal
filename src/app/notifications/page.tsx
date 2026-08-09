"use client";

import React, { useState, useEffect } from 'react';
import { Star, Banknote, Package, AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import '../../styles/dashboard.css';

import { Skeleton } from '../../components/ui/Skeleton';

const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
  star: { icon: <Star size={20} color="#f59e0b" />, color: '#f59e0b' },
  banknote: { icon: <Banknote size={20} color="#10b981" />, color: '#10b981' },
  package: { icon: <Package size={20} color="#f59e0b" />, color: '#f59e0b' },
  alert: { icon: <AlertTriangle size={20} color="#ef4444" />, color: '#ef4444' },
  check: { icon: <CheckCircle2 size={20} color="#10b981" />, color: '#10b981' },
  clock: { icon: <Clock size={20} color="#f59e0b" />, color: '#f59e0b' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/vendor/notifications');
        setNotifications(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div style={{ display: 'flex', gap: '16px', padding: i === 1 ? '0 0 20px' : '20px 0', alignItems: 'flex-start' }}>
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Skeleton width="160px" height="18px" />
                  <Skeleton width="80%" height="14px" />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <Skeleton width="60px" height="12px" />
                  </div>
                </div>
              </div>
              {i < 5 && <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: 0, opacity: 0.4 }} />}
            </div>
          ))}
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
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Notifications</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Stay updated on your store's activity</p>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {notifications.map((notif: any, index: number) => {
            const iconInfo = iconMap[notif.iconType] || iconMap.star;
            
            return (
              <React.Fragment key={notif.id}>
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: index === 0 ? '0 0 20px' : '20px 0',
                  alignItems: 'flex-start'
                }}>
                  {/* Icon */}
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: notif.iconBg || '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {iconInfo.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>{notif.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>{notif.desc}</p>
                    <span style={{ 
                      alignSelf: 'flex-end', 
                      fontSize: '11px', 
                      color: 'var(--royal-text-gray)',
                      marginTop: '4px'
                    }}>
                      {notif.time}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                {index < notifications.length - 1 && (
                  <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: 0, opacity: 0.4 }} />
                )}
              </React.Fragment>
            );
          })}

          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--royal-text-gray)' }}>
              <p>No notifications yet.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
