"use client";

import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Reply, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import '../../styles/dashboard.css';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Instant real-time reviews fetch
        
        const [reviewsData, statsData] = await Promise.all([
          fetchApi('/vendor/reviews'),
          fetchApi('/vendor/reviews/stats')
        ]);
        setReviews(reviewsData || []);
        setStats(statsData || { rating: 0, total: 0 });
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews. Backend API is unreachable.');
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'All') return true;
    if (activeTab === '5 Stars') return review.rating === 5;
    if (activeTab === '4 Stars') return review.rating === 4;
    if (activeTab === 'Critical') return review.rating <= 3;
    return true;
  });

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Customer Reviews</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Monitor and respond to customer feedback</p>
      </div>

      {isLoading ? (
        <>
          {/* Skeleton for Summary Card */}
          <div className="royal-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div>
                <Skeleton width="80px" height="48px" style={{ marginBottom: '8px' }} />
                <Skeleton width="100px" height="18px" />
              </div>
              <div style={{ width: '1px', height: '60px', background: 'var(--royal-border)' }} />
              <div>
                <Skeleton width="160px" height="20px" style={{ marginBottom: '8px' }} />
                <Skeleton width="220px" height="14px" />
              </div>
            </div>
          </div>
          
          {/* Skeleton for Reviews Grid */}
          <div className="reviews-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="royal-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Skeleton width="120px" height="18px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="80px" height="12px" />
                  </div>
                  <Skeleton width="80px" height="14px" />
                </div>
                <Skeleton width="140px" height="22px" borderRadius="6px" />
                <Skeleton width="100%" height="14px" style={{ marginTop: '8px' }} />
                <Skeleton width="90%" height="14px" />
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--royal-border)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Skeleton width="80px" height="30px" borderRadius="16px" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Summary Card */}
          <div className="royal-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '48px', fontWeight: 700, margin: 0, color: 'var(--royal-text-dark)', lineHeight: 1 }}>{stats?.rating || '0.0'}</h2>
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={18} fill={star <= Math.round(stats?.rating || 0) ? "var(--royal-gold)" : "none"} color={star <= Math.round(stats?.rating || 0) ? "var(--royal-gold)" : "#e2e8f0"} />
                  ))}
                </div>
              </div>
              <div style={{ width: '1px', height: '60px', background: 'var(--royal-border)' }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: 'var(--royal-text-dark)' }}>Excellent Store Rating</h3>
                <p style={{ fontSize: '13px', margin: 0, color: 'var(--royal-text-gray)' }}>Based on {stats?.total || 0} total reviews this month.</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '4px', margin: '0 -16px 20px', padding: '0 16px', gap: '8px' }}>
            {['All', '5 Stars', '4 Stars', 'Critical'].map(tab => (
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
        </>
      )}

      {error && !isLoading && (
        <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Reviews Grid */}
      {!isLoading && !error && (
        <div className="reviews-grid">
          {filteredReviews.map(review => (
            <div key={review.id} className="royal-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Header: Name, Date, Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>{review.customer}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>{review.date}</p>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={14} 
                      fill={star <= review.rating ? "var(--royal-gold)" : "none"} 
                      color={star <= review.rating ? "var(--royal-gold)" : "#e2e8f0"} 
                    />
                  ))}
                </div>
              </div>

              {/* Product Tag */}
              <div>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  color: 'var(--royal-maroon)', 
                  background: 'rgba(139, 29, 65, 0.05)', 
                  padding: '4px 8px', 
                  borderRadius: '6px' 
                }}>
                  Product: {review.product}
                </span>
              </div>

              {/* Review Text */}
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--royal-text-dark)', lineHeight: 1.5 }}>
                "{review.comment}"
              </p>

              {/* Actions */}
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed var(--royal-border)', display: 'flex', justifyContent: 'flex-end' }}>
                {review.replied ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>
                    <CheckCircle2 size={16} /> Replied
                  </span>
                ) : (
                  <button style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: 'none', 
                    border: '1px solid var(--royal-maroon)', 
                    color: 'var(--royal-maroon)', 
                    padding: '6px 14px', 
                    borderRadius: '16px', 
                    fontSize: '13px', 
                    fontWeight: 600,
                    cursor: 'pointer' 
                  }}>
                    <Reply size={14} /> Reply
                  </button>
                )}
              </div>

            </div>
          ))}
          {filteredReviews.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--royal-text-gray)', gridColumn: '1 / -1' }}>
              No reviews match this filter.
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
