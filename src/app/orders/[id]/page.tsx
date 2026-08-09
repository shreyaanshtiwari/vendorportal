"use client";

import React, { use, useState, useEffect } from 'react';
import { Phone, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { fetchApi } from '../../../lib/api';
import '../../../styles/dashboard.css';

import { Skeleton } from '../../../components/ui/Skeleton';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const rawId = unwrappedParams.id;
  const orderId = rawId.startsWith('OD') ? `#${rawId}` : `#OD${rawId}`;
  
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchApi(`/vendor/orders/${rawId}`);
        setOrderData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load order details. Backend API is unreachable.');
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [rawId]);
  
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="royal-card" style={{ padding: '20px' }}>
            <Skeleton width="120px" height="16px" style={{ marginBottom: '16px' }} />
            <Skeleton width="180px" height="20px" style={{ marginBottom: '12px' }} />
            <Skeleton width="200px" height="16px" style={{ marginBottom: '8px' }} />
            <Skeleton width="250px" height="16px" />
          </div>
          <div className="royal-card" style={{ padding: '20px' }}>
            <Skeleton width="100px" height="16px" style={{ marginBottom: '16px' }} />
            {[1, 2].map(i => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: i===1?'16px':0 }}>
                <Skeleton width="64px" height="64px" borderRadius="12px" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="140px" height="16px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="80px" height="14px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="60px" height="14px" />
                </div>
                <Skeleton width="60px" height="18px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px' }}>
          {error || 'Order not found.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Top Details */}
      <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '22px', margin: '0 0 8px', color: 'var(--royal-text-dark)', fontWeight: 700 }}>{orderId}</h2>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>Placed on {orderData.time}</p>
        </div>
        <span className={`status-badge status-${(orderData.status || '').toLowerCase()}`}>
          {orderData.status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Customer Details Card */}
        <div className="royal-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 16px', color: 'var(--royal-text-gray)', fontWeight: 600 }}>Customer Details</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', margin: '0 0 12px', color: 'var(--royal-text-dark)', fontWeight: 600 }}>{orderData.customer}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Phone size={14} color="var(--royal-text-gray)" />
                <span style={{ fontSize: '13px', color: 'var(--royal-text-gray)' }}>{orderData.phone || '+91 98765 43210'}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={14} color="var(--royal-text-gray)" style={{ marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: 'var(--royal-text-gray)' }}>{orderData.location}</span>
              </div>
            </div>
            
            <a href={`tel:${orderData.phone || '+919876543210'}`} style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'rgba(139, 29, 65, 0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--royal-maroon)',
              textDecoration: 'none'
            }}>
              <Phone size={18} />
            </a>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="royal-card" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', margin: '0 0 16px', color: 'var(--royal-text-gray)', fontWeight: 600 }}>Order Items</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orderData.items && Array.isArray(orderData.items) ? (
              orderData.items.map((item: any, idx: number) => (
                <div key={idx}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--royal-cream)' }}>
                      {item.image_url && <Image src={item.image_url} alt={item.name} fill style={{ objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '14px', margin: '0 0 4px', color: 'var(--royal-text-dark)' }}>{item.name}</h5>
                      <p style={{ fontSize: '12px', margin: '0 0 4px', color: 'var(--royal-text-gray)' }}>{item.weight}</p>
                      <p style={{ fontSize: '12px', margin: 0, color: 'var(--royal-text-gray)' }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{item.price}</div>
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
        <div style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--royal-text-gray)' }}>
            <span>Subtotal</span>
            <span style={{ color: 'var(--royal-text-dark)' }}>{orderData.subtotal || orderData.amount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--royal-text-gray)' }}>
            <span>Shipping Charge</span>
            <span style={{ color: 'var(--royal-text-dark)' }}>{orderData.shipping || '₹0'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--royal-text-gray)' }}>
            <span>COD Charge</span>
            <span style={{ color: 'var(--royal-text-dark)' }}>{orderData.cod || '₹0'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: 'var(--royal-text-dark)', marginTop: '8px', paddingTop: '12px', borderTop: '1px dashed var(--royal-border)' }}>
            <span>Total Amount</span>
            <span>{orderData.amount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <button style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'var(--royal-maroon)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            fontSize: '15px', 
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(74, 4, 4, 0.2)'
          }}>
            Accept Order
          </button>
          <button style={{ 
            width: '100%', 
            padding: '16px', 
            background: 'transparent', 
            color: 'var(--royal-maroon)', 
            border: '1px solid var(--royal-maroon)', 
            borderRadius: '12px', 
            fontSize: '15px', 
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Reject Order
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
