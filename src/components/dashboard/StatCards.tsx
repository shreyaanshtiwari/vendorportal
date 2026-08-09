"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, PackageOpen, Wallet, ArrowUp, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';

import { Skeleton } from '../ui/Skeleton';

const StatCards = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchApi('/vendor/stats');
        setStats(data || {
          totalOrders: 0,
          totalSales: 0,
          pendingOrders: 0,
          availableBalance: 0
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="stats-container">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="royal-card stat-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Skeleton width="48px" height="48px" borderRadius="12px" />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height="14px" style={{ marginBottom: '8px' }} />
              <Skeleton width="80%" height="28px" style={{ marginBottom: '8px' }} />
              <Skeleton width="40%" height="12px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-container" style={{ width: '100%' }}>
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', width: '100%' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="royal-card stat-card">
        <div className="stat-header">
          <div className="stat-icon" style={{background: '#fdf6e3', color: '#b8860b'}}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <h4 className="stat-title">Total Orders</h4>
            <h2 className="stat-value">{stats?.totalOrders || 0}</h2>
            <div className="stat-trend trend-up">
              <ArrowUp size={14} /> -- <span className="hide-mobile">vs last 30 days</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="royal-card stat-card">
        <div className="stat-header">
          <div className="stat-icon" style={{background: '#fdf6e3', color: '#b8860b'}}>
            <DollarSign size={24} />
          </div>
          <div>
            <h4 className="stat-title">Total Sales</h4>
            <h2 className="stat-value">₹{stats?.totalSales?.toLocaleString() || 0}</h2>
            <div className="stat-trend trend-up">
              <ArrowUp size={14} /> -- <span className="hide-mobile">vs last 30 days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="royal-card stat-card">
        <div className="stat-header">
          <div className="stat-icon" style={{background: '#fdf6e3', color: '#b8860b'}}>
            <PackageOpen size={24} />
          </div>
          <div>
            <h4 className="stat-title">Pending Orders</h4>
            <h2 className="stat-value">{stats?.pendingOrders || 0}</h2>
            <div className="stat-action">
              View and prepare orders
            </div>
          </div>
        </div>
      </div>

      <div className="royal-card stat-card">
        <div className="stat-header">
          <div className="stat-icon" style={{background: '#fdf6e3', color: '#b8860b'}}>
            <Wallet size={24} />
          </div>
          <div>
            <h4 className="stat-title">Available Balance</h4>
            <h2 className="stat-value">₹{stats?.availableBalance?.toLocaleString() || 0}</h2>
            <div className="stat-action">
              Payouts & settlements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;

