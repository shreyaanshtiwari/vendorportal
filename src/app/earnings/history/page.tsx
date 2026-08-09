"use client";

import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, RefreshCcw, XCircle, Loader2 } from 'lucide-react';
import { fetchApi } from '../../../lib/api';
import '../../../styles/dashboard.css';

type FilterType = 'All' | 'Completed' | 'Pending' | 'Failed';

import { Skeleton } from '../../../components/ui/Skeleton';

export default function PaymentHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const filters: FilterType[] = ['All', 'Completed', 'Pending', 'Failed'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApi('/vendor/earnings/history');
        setAllTransactions(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load payment history');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTransactions = activeFilter === 'All' 
    ? allTransactions 
    : allTransactions.filter(t => t.status === activeFilter);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Interactive Filter Bar */}
      <div style={{ 
        position: 'sticky', 
        top: '64px',
        background: 'var(--royal-bg)', 
        zIndex: 10,
        paddingBottom: '16px',
        marginBottom: '8px'
      }}>
        <div className="hide-scrollbar" style={{ 
          display: 'flex', 
          gap: '12px', 
          overflowX: 'auto', 
          padding: '0 16px',
          margin: '0 -16px'
        }}>
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                border: '1px solid',
                borderColor: activeFilter === filter ? 'var(--royal-maroon)' : 'var(--royal-border)',
                background: activeFilter === filter ? 'var(--royal-maroon)' : 'white',
                color: activeFilter === filter ? 'white' : 'var(--royal-text-gray)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: activeFilter === filter ? '0 4px 10px rgba(139, 29, 65, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Ledger */}
      <div style={{ paddingBottom: '80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {filteredTransactions.map((transaction: any) => {
            let iconBg = '#e6f4ea';
            let iconColor = '#28a745';
            let badgeBg = '#e6f4ea';
            let badgeColor = '#28a745';
            let IconComponent = ArrowDownLeft;

            if (transaction.status === 'Pending') {
              iconBg = '#fff3cd';
              iconColor = '#ffc107';
              badgeBg = '#fff3cd';
              badgeColor = '#d39e00';
              IconComponent = RefreshCcw;
            } else if (transaction.status === 'Failed') {
              iconBg = '#f8d7da';
              iconColor = '#dc3545';
              badgeBg = '#f8d7da';
              badgeColor = '#dc3545';
              IconComponent = XCircle;
            }

            return (
              <div key={transaction.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  background: iconBg, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComponent size={20} color={iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>Paid to {transaction.bank?.split(' ')[0]}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>{transaction.date}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--royal-text-dark)' }}>{transaction.amount}</span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 600,
                    color: badgeColor, 
                    background: badgeBg, 
                    padding: '4px 8px', 
                    borderRadius: '6px' 
                  }}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            );
          })}
          
          {filteredTransactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--royal-text-gray)' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No {activeFilter.toLowerCase()} transactions found.</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
