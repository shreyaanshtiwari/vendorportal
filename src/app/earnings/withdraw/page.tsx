"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import '../../../styles/dashboard.css';

export default function WithdrawPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Withdraw Balance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Withdraw Balance</h4>
          <div style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '12px', 
            border: '1px solid var(--royal-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, color: 'var(--royal-text-gray)' }}>Available Balance</p>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: 'var(--royal-text-dark)', fontFamily: 'var(--font-jakarta), sans-serif' }}>₹12,430</h2>
          </div>
        </div>

        {/* Withdraw to */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Withdraw to</h4>
          <div style={{ 
            padding: '16px 20px', 
            background: 'white', 
            borderRadius: '12px', 
            border: '1px solid var(--royal-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: 'var(--royal-text-dark)' }}>HDFC Bank ****4321</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>Shreyansh Kumar</p>
            </div>
            <ChevronRight size={18} color="var(--royal-text-gray)" />
          </div>
        </div>

        {/* Enter Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Enter Amount</h4>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--royal-text-gray)', fontSize: '16px', fontWeight: 500 }}>₹</span>
            <input 
              type="number" 
              placeholder="Enter amount" 
              style={{
                width: '100%',
                padding: '14px 60px 14px 40px',
                borderRadius: '12px',
                border: '1px solid var(--royal-border)',
                outline: 'none',
                fontSize: '15px',
                color: 'var(--royal-text-dark)',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            />
            <button style={{ 
              position: 'absolute', 
              right: '16px', 
              top: '14px', 
              background: 'none', 
              border: 'none', 
              color: 'var(--royal-maroon)', 
              fontWeight: 600, 
              fontSize: '14px', 
              cursor: 'pointer',
              padding: 0
            }}>
              Max
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>Minimum withdraw amount is ₹500</p>
        </div>

        {/* Withdraw Now Button */}
        <div style={{ marginTop: '8px' }}>
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
            Withdraw Now
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--royal-border)', margin: '8px 0', opacity: 0.5 }} />

        {/* Recent Payouts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>Recent Payouts</h3>
            <Link href="/earnings/history" style={{ background: 'none', border: 'none', color: 'var(--royal-maroon)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'none' }}>
              View All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Item 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--royal-text-dark)' }}>₹8,430</span>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>10 May, 2024</p>
              </div>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600,
                color: '#28a745', 
                background: '#e6f4ea', 
                padding: '4px 8px', 
                borderRadius: '6px' 
              }}>
                Success
              </span>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px dashed var(--royal-border)', margin: '0', opacity: 0.5 }} />

            {/* Item 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--royal-text-dark)' }}>₹11,250</span>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>25 Apr, 2024</p>
              </div>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600,
                color: '#28a745', 
                background: '#e6f4ea', 
                padding: '4px 8px', 
                borderRadius: '6px' 
              }}>
                Success
              </span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px dashed var(--royal-border)', margin: '0', opacity: 0.5 }} />

            {/* Item 3 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--royal-text-dark)' }}>₹9,780</span>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--royal-text-gray)' }}>10 Apr, 2024</p>
              </div>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600,
                color: '#28a745', 
                background: '#e6f4ea', 
                padding: '4px 8px', 
                borderRadius: '6px' 
              }}>
                Success
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
