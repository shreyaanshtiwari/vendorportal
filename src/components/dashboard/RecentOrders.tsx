"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';

const RecentOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchApi('/vendor/orders');
        // Only show up to 5 recent orders on the dashboard
        setOrders((data || []).slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="royal-card recent-orders-section">
      <div className="section-header">
        <h3>Recent Orders</h3>
        <Link href="/orders" className="view-all">View All Orders</Link>
      </div>

      {isLoading && (
        <div className="orders-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="order-item" style={{ borderBottom: '1px solid var(--royal-border)' }}>
              <div style={{ flex: 1 }}><Skeleton width="70%" height="16px" style={{ marginBottom: '6px' }}/><Skeleton width="50%" height="12px" /></div>
              <div style={{ flex: 1 }}><Skeleton width="60%" height="16px" style={{ marginBottom: '6px' }}/><Skeleton width="80%" height="12px" /></div>
              <div style={{ flex: 1 }}><Skeleton width="50%" height="16px" style={{ marginBottom: '6px' }}/><Skeleton width="40%" height="12px" /></div>
              <div style={{ flex: 0.5, display: 'flex', justifyContent: 'flex-end' }}><Skeleton width="70px" height="26px" borderRadius="20px" /></div>
            </div>
          ))}
        </div>
      )}

      {error && !isLoading && (
        <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {orders.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--royal-text-gray)' }}>
              No recent orders found.
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  <div className="order-id">
                    <h5>{order.id}</h5>
                    <p>{order.time}</p>
                  </div>
                  <div className="order-customer">
                    <h5>{order.customer}</h5>
                    <p>{order.location}</p>
                  </div>
                  <div className="order-amount">
                    <h5>{order.amount}</h5>
                    <p>{Array.isArray(order.items) ? order.items.length : order.items} items</p>
                  </div>
                  <div className="status-badge-container">
                    <span className={`status-badge status-${(order.status || '').toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/orders" style={{ textDecoration: 'none', display: 'block' }}>
            <button className="view-all-btn" style={{ width: '100%', cursor: 'pointer' }}>View All Orders</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default RecentOrders;

