"use client";

import React from 'react';
import { Headset, HelpCircle, ShieldAlert, MessageSquare, ChevronRight } from 'lucide-react';

export default function SupportPage() {
  
  const supportOptions = [
    {
      id: 1,
      title: 'Help Center',
      desc: 'View articles and FAQs',
      icon: <HelpCircle size={20} color="#ef4444" />,
      iconBg: '#fee2e2'
    },
    {
      id: 2,
      title: 'Raise a Ticket',
      desc: 'Get help for your issues',
      icon: <ShieldAlert size={20} color="#f59e0b" />,
      iconBg: '#fef3c7'
    },
    {
      id: 3,
      title: 'Contact Us',
      desc: 'Chat or call with our team',
      icon: <MessageSquare size={20} color="#14b8a6" />, // teal
      iconBg: '#ccfbf1'
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>Support</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Get help and support for your store</p>
      </div>

      {/* Support Card Layout */}
      <div style={{ 
        padding: '4px 0 0',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        {/* Hero Card */}
        <div style={{
          background: '#fff8eb', // Pale cream
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--royal-maroon)' }}>
              How can we help you?
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>
              We're here to support you 24/7
            </p>
          </div>
          <Headset size={36} color="var(--royal-maroon)" strokeWidth={1.5} />
        </div>

        {/* Action List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {supportOptions.map((option) => (
            <button key={option.id} style={{
              background: 'white',
              border: '1px solid var(--royal-border)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              textAlign: 'left'
            }}>
              
              {/* Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: option.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {option.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--royal-text-dark)' }}>
                  {option.title}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--royal-text-gray)' }}>
                  {option.desc}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight size={20} color="var(--royal-text-gray)" opacity={0.6} />
              
            </button>
          ))}
        </div>

        {/* Footer Text */}
        <p style={{ 
          textAlign: 'center', 
          color: 'var(--royal-text-gray)', 
          fontSize: '12px',
          margin: '24px 0 0',
          padding: '0 20px',
          lineHeight: '1.5'
        }}>
          Our support team usually replies<br/>within a few hours.
        </p>

      </div>
    </div>
  );
}
