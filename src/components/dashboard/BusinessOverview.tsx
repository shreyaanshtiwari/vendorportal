"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';

const BusinessOverview = () => {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [chartData, statsData] = await Promise.all([
          fetchApi('/vendor/analytics/chart'),
          fetchApi('/vendor/analytics/stats')
        ]);
        setData(chartData || []);
        setStats(statsData || { totalSales: 0 });
      } catch (err: any) {
        setError(err.message || 'Failed to load business overview.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="royal-card business-overview-section">
      <div className="chart-header">
        <h3>Business Overview</h3>
        <select className="time-filter">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>

      {isLoading && (
        <div style={{ marginTop: '20px' }}>
          <Skeleton width="120px" height="14px" style={{ marginBottom: '8px' }} />
          <Skeleton width="160px" height="32px" style={{ marginBottom: '16px' }} />
          <Skeleton width="100%" height="240px" borderRadius="12px" />
        </div>
      )}

      {error && !isLoading && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginTop: '16px', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="chart-stats">
            <p style={{color: '#2A1713', fontSize: '14px', fontWeight: '500', marginBottom: '4px'}}>Total Sales</p>
            <h2>₹{stats?.totalSales?.toLocaleString() || 0}</h2>
            <p className="stat-trend trend-up">
              <ArrowUp size={14} /> --% vs last month
            </p>
          </div>
          <div style={{ height: '240px', marginTop: '20px', position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--royal-maroon)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--royal-maroon)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6d5c3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6E5A53'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6E5A53'}} tickFormatter={(value) => `${value/1000}K`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e0c080', background: '#fff' }}
                    itemStyle={{ color: 'var(--royal-maroon)' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="var(--royal-maroon)" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--royal-text-gray)' }}>
                  No chart data available.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div style={{ marginTop: '32px' }}>
        <Link href="/analytics" style={{ textDecoration: 'none', display: 'block' }}>
          <button className="view-all-btn" style={{ width: '100%', cursor: 'pointer' }}>View Full Analytics</button>
        </Link>
      </div>
    </div>
  );
};

export default BusinessOverview;

