"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, Users, ShoppingBag, DollarSign, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import '../../styles/dashboard.css';

const COLORS = ['#8B1D41', '#b83b5e', '#f0a500', '#f6d365'];

import { Skeleton } from '../../components/ui/Skeleton';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('This Month');
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsRes, statsRes] = await Promise.all([
          fetchApi('/vendor/analytics/advanced'),
          fetchApi('/vendor/stats'),
        ]);
        setSalesData(analyticsRes.salesData || []);
        setProductData(analyticsRes.topProducts || []);
        setTrafficData(analyticsRes.trafficSources || []);
        setStats(statsRes);
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
        <div className="analytics-kpi-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="royal-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="42px" height="42px" borderRadius="10px" />
                <Skeleton width="40px" height="16px" />
              </div>
              <div>
                <Skeleton width="80px" height="14px" style={{ marginBottom: '6px' }} />
                <Skeleton width="120px" height="28px" />
              </div>
            </div>
          ))}
        </div>
        <div className="royal-card" style={{ padding: '24px' }}>
          <Skeleton width="160px" height="22px" style={{ marginBottom: '8px' }} />
          <Skeleton width="200px" height="14px" style={{ marginBottom: '24px' }} />
          <Skeleton width="100%" height="320px" borderRadius="12px" />
        </div>
        <div className="analytics-bottom-grid">
          <div className="royal-card" style={{ padding: '24px' }}>
            <Skeleton width="180px" height="22px" style={{ marginBottom: '8px' }} />
            <Skeleton width="200px" height="14px" style={{ marginBottom: '24px' }} />
            <Skeleton width="100%" height="280px" borderRadius="12px" />
          </div>
          <div className="royal-card" style={{ padding: '24px' }}>
            <Skeleton width="140px" height="22px" style={{ marginBottom: '8px' }} />
            <Skeleton width="180px" height="14px" style={{ marginBottom: '24px' }} />
            <Skeleton width="200px" height="200px" borderRadius="50%" style={{ margin: '0 auto' }} />
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
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Header & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Store Performance</h2>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--royal-text-gray)' }}>Analyze your key metrics and sources</p>
        </div>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ 
            padding: '10px 16px', 
            borderRadius: '12px', 
            border: '1px solid var(--royal-border)',
            background: 'white',
            color: 'var(--royal-text-dark)',
            fontWeight: 600,
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            cursor: 'pointer'
          }}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Grid */}
      <div className="analytics-kpi-grid">
        <div className="royal-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '10px' }}>
              <DollarSign size={22} color="#f59e0b" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUp size={14} /> 12%
            </span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>Total Revenue</p>
            <h3 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>₹{stats?.totalSales?.toLocaleString() || '0'}</h3>
          </div>
        </div>

        <div className="royal-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '10px' }}>
              <ShoppingBag size={22} color="#6366f1" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUp size={14} /> 8%
            </span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>Total Orders</p>
            <h3 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="royal-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '10px' }}>
              <TrendingUp size={22} color="#22c55e" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowDown size={14} /> 2%
            </span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>Conversion Rate</p>
            <h3 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>3.2%</h3>
          </div>
        </div>

        <div className="royal-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '10px' }}>
              <Users size={22} color="#ef4444" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUp size={14} /> 24%
            </span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>Store Views</p>
            <h3 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>26,300</h3>
          </div>
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div className="royal-card" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Revenue Trend</h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--royal-text-gray)' }}>Your sales performance over time</p>
        </div>
        <div style={{ height: '320px', width: '100%', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--royal-maroon)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--royal-maroon)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6d5c3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6E5A53'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6E5A53'}} tickFormatter={(value) => `₹${value/1000}K`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e0c080', background: '#fff' }}
                  itemStyle={{ color: 'var(--royal-maroon)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--royal-maroon)" strokeWidth={3} fillOpacity={1} fill="url(#colorAnalytics)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Products & Traffic */}
      <div className="analytics-bottom-grid">
        
        {/* Top Products Bar Chart */}
        <div className="royal-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Top Selling Products</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--royal-text-gray)' }}>Revenue generated per product</p>
          </div>
          <div style={{ height: '280px', width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6d5c3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6E5A53'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6E5A53'}} tickFormatter={(value) => `₹${value/1000}K`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(74, 4, 4, 0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e0c080', background: '#fff' }}
                  />
                  <Bar dataKey="revenue" fill="var(--royal-gold)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Traffic Sources Pie Chart */}
        <div className="royal-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Traffic Sources</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--royal-text-gray)' }}>Where your customers come from</p>
          </div>
          <div style={{ flex: 1, position: 'relative', minHeight: '220px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {trafficData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
            {trafficData.map((entry: any, index: number) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--royal-text-gray)', fontWeight: 500 }}>{entry.name}</span>
                <span style={{ fontSize: '13px', color: 'var(--royal-text-dark)', fontWeight: 700, marginLeft: 'auto' }}>{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
