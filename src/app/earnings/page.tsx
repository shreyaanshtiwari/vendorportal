"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowDownLeft, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import '../../styles/dashboard.css';

import { Skeleton } from '../../components/ui/Skeleton';

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [earningsRes, historyRes] = await Promise.all([
          fetchApi('/vendor/earnings'),
          fetchApi('/vendor/earnings/history'),
        ]);
        setEarnings(earningsRes);
        setHistory(historyRes?.slice(0, 3) || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load earnings');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Skeleton width="100%" height="120px" borderRadius="20px" />
        </div>
        <div className="royal-card" style={{ marginBottom: '32px', padding: '24px 20px' }}>
          <Skeleton width="100px" height="16px" style={{ marginBottom: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Skeleton width="160px" height="32px" />
            <Skeleton width="60px" height="16px" />
          </div>
          <Skeleton width="80px" height="14px" />
        </div>
        <div style={{ paddingBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Skeleton width="140px" height="20px" />
            <Skeleton width="60px" height="14px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Skeleton width="44px" height="44px" borderRadius="12px" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="120px" height="16px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="80px" height="12px" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <Skeleton width="70px" height="16px" />
                  <Skeleton width="60px" height="20px" borderRadius="6px" />
                </div>
              </div>
            ))}
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
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Payouts & Earnings</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Track your revenue and bank transfers</p>
      </div>

      {/* Available Balance Card */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '24px 20px', 
        background: 'linear-gradient(135deg, #fdf8eb 0%, #faecd0 100%)',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Available Balance</p>
          <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 700, color: 'var(--royal-text-dark)', fontFamily: 'var(--font-jakarta), sans-serif' }}>₹{earnings?.availableBalance?.toLocaleString() || '0'}</h2>
        </div>
        <Link href="/earnings/withdraw" style={{ 
          background: 'var(--royal-maroon)', 
          color: 'white', 
          border: 'none', 
          padding: '12px 20px', 
          borderRadius: '12px', 
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          textDecoration: 'none'
        }}>
          Withdraw
        </Link>
      </div>

      {/* Total Earnings Card */}
      <div className="royal-card" style={{ marginBottom: '32px', padding: '24px 20px' }}>
        <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Total Earnings</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>₹{earnings?.totalEarnings?.toLocaleString() || '0'}</h2>
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2px', 
            color: '#28a745', 
            fontSize: '13px', 
            fontWeight: 700 
          }}>
            <ArrowUp size={14} strokeWidth={3} /> {earnings?.growthPercent || 0}%
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>This Month</p>
      </div>

      {/* Payout History */}
      <div style={{ paddingBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Payout History</h3>
          <Link href="/earnings/history" style={{ background: 'none', border: 'none', color: 'var(--royal-maroon)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'none' }}>
            View All
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {history.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: item.status === 'Completed' ? '#e6f4ea' : item.status === 'Pending' ? '#fff3cd' : '#f8d7da', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ArrowDownLeft size={20} color={item.status === 'Completed' ? '#28a745' : item.status === 'Pending' ? '#d39e00' : '#dc3545'} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Paid to {item.bank?.split(' ')[0]}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>{item.date}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--royal-text-dark)' }}>{item.amount}</span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 600,
                  color: item.status === 'Completed' ? '#28a745' : item.status === 'Pending' ? '#d39e00' : '#dc3545', 
                  background: item.status === 'Completed' ? '#e6f4ea' : item.status === 'Pending' ? '#fff3cd' : '#f8d7da', 
                  padding: '4px 8px', 
                  borderRadius: '6px' 
                }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--royal-text-gray)' }}>
              <p>No payout history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
