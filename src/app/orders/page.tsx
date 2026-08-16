"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import '../../styles/dashboard.css';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const TABS = [
    { id: 'ALL', label: 'All' },
    { id: 'CONFIRMED', label: 'New / Confirmed' },
    { id: 'VENDOR_PROCESSING', label: 'Processing' },
    { id: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { id: 'AGENT_ASSIGNED', label: 'Agent Assigned' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

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

  const filteredOrders = activeTab === 'ALL'
    ? orders
    : orders.filter(o => (o.status || '').toUpperCase() === activeTab);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Orders</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Manage and fulfill incoming customer orders</p>
      </div>

      {/* Category Tabs */}
      <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '4px', margin: '0 -16px 16px', padding: '0 16px', gap: '8px' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? 'var(--royal-maroon)' : 'white',
              border: activeTab === tab.id ? 'none' : '1px solid var(--royal-border)',
              borderRadius: '20px',
              color: activeTab === tab.id ? 'white' : 'var(--royal-text-gray)',
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 4px 10px rgba(139, 29, 65, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="royal-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Skeleton width="100px" height="18px" style={{ marginBottom: '6px' }} />
              <Skeleton width="140px" height="14px" />
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
          {filteredOrders.length > 0 ? filteredOrders.map((order) => {
            const st = (order.status || 'PENDING').toUpperCase();
            return (
              <div key={order.id} className="royal-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                  <div className="order-id">
                    <h5 style={{ fontSize: '15px', margin: '0 0 4px', fontWeight: 700 }}>#{order.id.substring(0, 8)}</h5>
                    <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>{order.time || order.created_at || order.date}</p>
                  </div>
                  <div className="status-badge-container">
                    <span className={`status-badge status-${st.toLowerCase()}`}>
                      {st.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 0', borderTop: '1px dashed var(--royal-border)', borderBottom: '1px dashed var(--royal-border)' }}>
                  <div className="order-customer">
                    <h5 style={{ fontSize: '14px', margin: '0 0 4px' }}>{order.customer || order.customerName || order.userName || 'Customer'}</h5>
                    <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>{order.location || order.deliveryAddress || 'Standard Delivery'}</p>
                  </div>
                  <div className="order-amount" style={{ textAlign: 'right' }}>
                    <h5 style={{ fontSize: '15px', margin: '0 0 4px', color: 'var(--royal-maroon)' }}>₹{order.amount || order.totalAmount || order.total}</h5>
                    <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>{Array.isArray(order.items) ? order.items.length : order.items || 1} items</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  <Link href={`/orders/${order.id}`} style={{ textDecoration: 'none', color: 'var(--royal-maroon)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Process Order <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          }) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--royal-text-gray)' }}>
              No orders found for this status.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
