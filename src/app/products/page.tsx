"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MoreVertical, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { fetchApi } from '../../lib/api';
import '../../styles/dashboard.css';

import { Skeleton } from '../../components/ui/Skeleton';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchApi('/vendor/products');
        setProducts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load products. Backend API is unreachable.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>My Products</h1>
          <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Manage your inventory and pricing</p>
        </div>
        <Link href="/products/add" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--royal-maroon)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(139, 29, 65, 0.2)'
        }}>
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Search Toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--royal-text-gray)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            style={{ 
              width: '100%', 
              padding: '12px 16px 12px 42px', 
              borderRadius: '12px', 
              border: '1px solid var(--royal-border)', 
              outline: 'none',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          />
        </div>
        <button style={{ 
          padding: '12px', 
          background: 'white', 
          border: '1px solid var(--royal-border)', 
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="royal-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Skeleton width="80px" height="80px" borderRadius="12px" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Skeleton width="40%" height="18px" style={{ marginBottom: '8px' }} />
                <Skeleton width="20%" height="12px" style={{ marginBottom: '8px' }} />
                <Skeleton width="30%" height="12px" style={{ marginBottom: '8px' }} />
                <Skeleton width="15%" height="12px" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'space-between' }}>
                <Skeleton width="18px" height="18px" style={{ marginBottom: '8px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <Skeleton width="60px" height="16px" />
                  <Skeleton width="100px" height="24px" borderRadius="6px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && !isLoading && (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px' }}>
          {error}
        </div>
      )}

      {/* Product List */}
      {!isLoading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--royal-text-gray)' }}>
              No products found. Add your first product to get started!
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="royal-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                
                {/* Product Image */}
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--royal-cream)' }}>
                  {product.image_url && <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />}
                </div>
                
                {/* Product Details (Middle) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>{product.name}</h4>
                  {product.category && <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--royal-text-gray)' }}>{product.category}</p>}
                  <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--royal-text-gray)' }}>{product.approval_status ? (product.approval_status === 'pending' ? 'Pending Approval' : product.approval_status.charAt(0).toUpperCase() + product.approval_status.slice(1)) : 'Pending'}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#059669', fontWeight: 600 }}>• Running</p>
                </div>
                
                {/* Action & Price (Right) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100%', justifyContent: 'space-between' }}>
                  <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--royal-text-gray)', marginBottom: '8px' }}>
                    <MoreVertical size={18} />
                  </button>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--royal-text-dark)' }}>{product.price}</span>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 600,
                      color: product.approval_status === 'rejected' ? '#b91c1c' : (product.approval_status === 'approved' || product.approval_status === 'verified' ? '#28a745' : '#d97706'), 
                      background: product.approval_status === 'rejected' ? '#fee2e2' : (product.approval_status === 'approved' || product.approval_status === 'verified' ? '#e6f4ea' : '#fef3c7'), 
                      padding: '4px 8px', 
                      borderRadius: '6px' 
                    }}>
                      {product.approval_status ? (product.approval_status === 'pending' ? 'Pending Approval' : product.approval_status.charAt(0).toUpperCase() + product.approval_status.slice(1)) : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

