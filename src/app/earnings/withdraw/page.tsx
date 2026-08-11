"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import '../../../styles/dashboard.css';
import { fetchApi } from '../../../lib/api';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function WithdrawPage() {
  const [earnings, setEarnings] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

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
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleMaxClick = () => {
    if (earnings?.availableBalance) {
      setWithdrawAmount(earnings.availableBalance.toString());
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton width="100%" height="100px" borderRadius="12px" />
          <Skeleton width="100%" height="80px" borderRadius="12px" />
          <Skeleton width="100%" height="80px" borderRadius="12px" />
          <Skeleton width="100%" height="50px" borderRadius="12px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', margin: '20px', maxWidth: '800px', marginInline: 'auto' }}>
        {error}
      </div>
    );
  }

  const availableBalance = earnings?.availableBalance || 0;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Withdraw Balance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Withdraw Balance</h4>
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid var(--royal-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Available Balance</p>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--royal-text-dark)', fontFamily: 'var(--font-jakarta), sans-serif' }}>
              ₹{availableBalance.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Withdraw to */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Withdraw to</h4>
          <div style={{
            padding: '16px 20px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid var(--royal-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Add Bank Account</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>Link your bank details</p>
            </div>
            <ChevronRight size={18} color="var(--royal-text-gray)" />
          </div>
        </div>

        {/* Enter Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Enter Amount</h4>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--royal-text-gray)', fontSize: '16px', fontWeight: 500 }}>₹</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              max={availableBalance}
              style={{
                width: '100%',
                padding: '14px 60px 14px 40px',
                borderRadius: '12px',
                border: '1px solid var(--royal-border)',
                outline: 'none',
                fontSize: '15px',
                color: 'var(--royal-text-dark)',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            />
            <button
              onClick={handleMaxClick}
              style={{
                position: 'absolute',
                right: '16px',
                top: '14px',
                background: 'none',
                border: 'none',
                color: 'var(--royal-maroon)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                padding: 0
              }}>
              Max
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>Minimum withdraw amount is ₹500</p>
        </div>

        {/* Withdraw Now Button */}
        <div style={{ marginTop: '8px' }}>
          <button
            disabled={!withdrawAmount || Number(withdrawAmount) < 500 || Number(withdrawAmount) > availableBalance}
            style={{
              width: '100%',
              padding: '16px',
              background: (!withdrawAmount || Number(withdrawAmount) < 500 || Number(withdrawAmount) > availableBalance) ? '#ccc' : 'var(--royal-maroon)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: (!withdrawAmount || Number(withdrawAmount) < 500 || Number(withdrawAmount) > availableBalance) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(74, 4, 4, 0.2)'
            }}>
            Withdraw Now
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: '8px 0', opacity: 0.5 }} />

        {/* Recent Payouts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Recent Payouts</h3>
            <Link href="/earnings/history" style={{ background: 'none', border: 'none', color: 'var(--royal-maroon)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'none' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {history.length > 0 ? history.map((item: any, index: number) => (
              <React.Fragment key={item.id || index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--royal-text-dark)' }}>{item.amount}</span>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>{item.date}</p>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: item.status === 'Completed' || item.status === 'Success' ? '#28a745' : item.status === 'Pending' ? '#d39e00' : '#dc3545',
                    background: item.status === 'Completed' || item.status === 'Success' ? '#e6f4ea' : item.status === 'Pending' ? '#fff3cd' : '#f8d7da',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {item.status}
                  </span>
                </div>
                {index < history.length - 1 && (
                  <hr style={{ border: 'none', borderTop: '1px dashed var(--royal-border)', margin: '0', opacity: 0.5 }} />
                )}
              </React.Fragment>
            )) : (
              <p style={{ textAlign: 'center', color: 'var(--royal-text-gray)', margin: '20px 0' }}>No recent payouts found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
