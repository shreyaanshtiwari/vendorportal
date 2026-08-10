"use client";

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';

const ProductPerformance = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        const data = await fetchApi('/vendor/analytics/products');
        setProducts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load product performance.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPerformance();
  }, []);

  return (
    <div className="royal-card product-performance-section">
      <div className="section-header">
        <h3>Product Performance (Top 4)</h3>
        <a href="#" className="view-all">View All Products</a>
      </div>

      {isLoading && (
        <div className="products-list">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="product-item">
              <Skeleton width="100%" height="120px" borderRadius="8px" style={{ marginBottom: '12px' }} />
              <div className="product-info">
                <Skeleton width="80%" height="14px" style={{ marginBottom: '6px' }} />
                <Skeleton width="50%" height="12px" style={{ marginBottom: '12px' }} />
              </div>
              <div className="product-stats">
                <Skeleton width="40%" height="12px" />
                <Skeleton width="30%" height="12px" />
              </div>
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
        <div className="products-list">
          {products.length > 0 ? products.map((product, index) => {
            const fallbackImages = [
              'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200',
              'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=200',
              'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200',
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200'
            ];
            const displayImg = product.img || fallbackImages[index % fallbackImages.length];
            return (
            <div key={product.id} className="product-item">
              <img src={displayImg} alt={product.name} className="product-img" />
              <div className="product-info">
                <h5>{product.name}</h5>
                <p>{product.price}/{product.unit}</p>
              </div>
              <div className="product-stats">
                <span className="sold">Sold {product.sold}</span>
                <span className="growth">↑ {product.growth}</span>
              </div>
            </div>
            );
          }) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--royal-text-gray)' }}>
              No top products to display.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPerformance;

