"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import '../../styles/dashboard.css'; // Reuse some styles

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchApi('/vendor/orders');
        setOrders(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders. Backend API is unreachable.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);
  
  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Orders</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Manage and track your customer orders</p>
      </div>
      
      {/* Category Tabs */}
      <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '4px', margin: '0 -16px 16px', padding: '0 16px', gap: '8px' }}>
        {['All', 'Pending', 'Confirmed'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '8px 16px', 
              background: activeTab === tab ? 'var(--royal-maroon)' : 'white', 
              border: activeTab === tab ? 'none' : '1px solid var(--royal-border)', 
              borderRadius: '20px',
              color: activeTab === tab ? 'white' : 'var(--royal-text-gray)',
              fontWeight: activeTab === tab ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab ? '0 4px 10px rgba(139, 29, 65, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Search Toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 42px', 
              borderRadius: '12px', 
              border: 'none', 
              outline: 'none',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          />
        </div>
        <button style={{ 
          padding: '12px', 
          background: 'white', 
          border: 'none', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Filter size={20} color="var(--royal-text-dark)" />
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="royal-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <div className="order-id">
                  <Skeleton width="100px" height="18px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="140px" height="14px" />
                </div>
                <Skeleton width="80px" height="24px" borderRadius="20px" />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 0', borderTop: '1px dashed var(--royal-border)', borderBottom: '1px dashed var(--royal-border)' }}>
                <div className="order-customer">
                  <Skeleton width="120px" height="16px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="90px" height="14px" />
                </div>
                <div className="order-amount" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Skeleton width="70px" height="18px" style={{ marginBottom: '6px' }} />
                  <Skeleton width="50px" height="14px" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Skeleton width="90px" height="16px" />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && !isLoading && (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      
      {/* Order List */}
      {!isLoading && !error && (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.length > 0 ? filteredOrders.map((order) => (
            <div key={order.id} className="royal-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                <div className="order-id">
                  <h5 style={{ fontSize: '15px', margin: '0 0 4px', fontWeight: 700 }}>{order.id}</h5>
                  <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>{order.time}</p>
                </div>
                <div className="status-badge-container">
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 0', borderTop: '1px dashed var(--royal-border)', borderBottom: '1px dashed var(--royal-border)' }}>
                <div className="order-customer">
                  <h5 style={{ fontSize: '14px', margin: '0 0 4px' }}>{order.customer}</h5>
                  <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>{order.location}</p>
                </div>
                <div className="order-amount" style={{ textAlign: 'right' }}>
                  <h5 style={{ fontSize: '15px', margin: '0 0 4px', color: 'var(--royal-maroon)' }}>{order.amount}</h5>
                  <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>{order.items} items</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Link href={`/orders/${order.id.replace('#', '')}`} style={{ textDecoration: 'none', color: 'var(--royal-text-gray)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Details <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--royal-text-gray)' }}>
              No orders found for this status.
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

