"use client";

import React, { use, useState, useEffect } from 'react';
import { Phone, MapPin, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchApi } from '../../../lib/api';
import '../../../styles/dashboard.css';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const rawId = unwrappedParams.id;
  
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi(`/vendor/orders/${rawId}`);
      setOrderData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details. Backend API is unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [rawId]);

  const handleUpdateStatus = async (targetStatus: string) => {
    try {
      setIsUpdating(true);
      setError('');
      setSuccessMsg('');

      const res = await fetchApi(`/vendor/orders/${rawId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: targetStatus, notes: `Vendor updated items to ${targetStatus}` })
      });

      setSuccessMsg(`Status successfully updated to ${targetStatus.replace(/_/g, ' ')}!`);
      await loadOrder();
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <Skeleton width="120px" height="26px" style={{ marginBottom: '8px' }} />
            <Skeleton width="160px" height="14px" />
          </div>
          <Skeleton width="80px" height="24px" borderRadius="20px" />
        </div>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginTop: '20px' }}>
          {error || 'Order not found.'}
        </div>
        <Link href="/orders" style={{ display: 'inline-block', marginTop: '16px', color: 'var(--royal-maroon)', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const currentStatus = (orderData?.status || 'PENDING').toUpperCase();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      
      <div style={{ padding: '16px 0 8px' }}>
        <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--royal-text-gray)', textDecoration: 'none', fontSize: '13px', marginBottom: '12px' }}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>

      {/* Top Details */}
      <div style={{ padding: '8px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '22px', margin: '0 0 4px', color: 'var(--royal-text-dark)', fontWeight: 700 }}>
            Order #{orderData?.id?.substring(0, 8)}
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>
            Placed on {orderData?.time || orderData?.created_at || orderData?.date}
          </p>
        </div>
        <span className={`status-badge status-${currentStatus.toLowerCase()}`} style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700 }}>
          {currentStatus.replace(/_/g, ' ')}
        </span>
      </div>

      {successMsg && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {error && (
        <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Workflow Action Header Banner */}
        {currentStatus === 'CONFIRMED' && (
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#92400e', fontSize: '0.95rem', fontWeight: 700 }}>Order Confirmed by Admin</h4>
              <p style={{ margin: 0, color: '#b45309', fontSize: '0.8rem' }}>Start preparing the sweets/items in your kitchen/shop.</p>
            </div>
            <button
              onClick={() => handleUpdateStatus('VENDOR_PROCESSING')}
              disabled={isUpdating}
              style={{
                padding: '10px 18px',
                background: '#d97706',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isUpdating ? 'Updating...' : 'Start Preparing'}
            </button>
          </div>
        )}

        {currentStatus === 'VENDOR_PROCESSING' && (
          <div style={{ background: '#e0f2fe', border: '1px solid #bae6fd', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#0369a1', fontSize: '0.95rem', fontWeight: 700 }}>Currently Preparing</h4>
              <p style={{ margin: 0, color: '#0284c7', fontSize: '0.8rem' }}>When packaging is done, mark items ready for delivery agent pickup.</p>
            </div>
            <button
              onClick={() => handleUpdateStatus('READY_FOR_PICKUP')}
              disabled={isUpdating}
              style={{
                padding: '10px 18px',
                background: '#0284c7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isUpdating ? 'Updating...' : 'Mark Ready for Pickup'}
            </button>
          </div>
        )}

        {currentStatus === 'READY_FOR_PICKUP' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 4px', color: '#15803d', fontSize: '0.95rem', fontWeight: 700 }}>Ready for Pickup</h4>
            <p style={{ margin: 0, color: '#166534', fontSize: '0.8rem' }}>The central hub / admin is assigning a delivery agent to collect this parcel.</p>
          </div>
        )}

        {/* Customer Details Card */}
        <div className="royal-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 16px', color: 'var(--royal-text-gray)', fontWeight: 600 }}>Customer Details</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', margin: '0 0 8px', color: 'var(--royal-text-dark)', fontWeight: 600 }}>
                {orderData?.customer || orderData?.customerName || orderData?.userName || 'Customer'}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Phone size={14} color="var(--royal-text-gray)" />
                <span style={{ fontSize: '13px', color: 'var(--royal-text-gray)' }}>{orderData?.phone || '+91 98765 43210'}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={14} color="var(--royal-text-gray)" style={{ marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: 'var(--royal-text-gray)' }}>{orderData?.location || orderData?.deliveryAddress || 'Address on file'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="royal-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 16px', color: 'var(--royal-text-gray)', fontWeight: 600 }}>Order Items</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orderData?.items && Array.isArray(orderData.items) ? (
              orderData.items.map((item: any, idx: number) => (
                <div key={idx}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '14px', margin: '0 0 4px', color: 'var(--royal-text-dark)' }}>
                        {item.name || item.product_name || item.productName || 'Specialty Sweet'}
                      </h5>
                      <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--royal-maroon)' }}>
                      ₹{item.subtotal || (parseFloat(item.price || '0') * parseInt(item.quantity || '1', 10))}
                    </div>
                  </div>
                  {idx < orderData.items.length - 1 && (
                    <div style={{ height: '1px', background: 'var(--royal-border)', opacity: 0.5, marginTop: '16px' }}></div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--royal-text-gray)' }}>No items found.</p>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: 'var(--royal-text-dark)', paddingTop: '12px', borderTop: '1px dashed var(--royal-border)' }}>
            <span>Total Amount</span>
            <span>₹{orderData?.amount || orderData?.totalAmount || orderData?.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
