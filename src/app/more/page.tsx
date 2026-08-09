"use client";

import React from 'react';
import { User, HelpCircle, History, LogOut, ChevronRight, Settings } from 'lucide-react';
import Link from 'next/link';

export default function MoreOptionsPage() {
  
  const menuOptions = [
    {
      id: 1,
      title: 'Store Profile',
      desc: 'View and edit store details',
      icon: <User size={20} color="white" />,
      iconBg: 'var(--royal-maroon)',
      href: '/profile'
    },
    {
      id: 2,
      title: 'Payment History',
      desc: 'View past payouts',
      icon: <History size={20} color="#f59e0b" />, // Gold
      iconBg: '#fef3c7',
      href: '/earnings/history'
    },
    {
      id: 3,
      title: 'Help & Support',
      desc: 'Get help with your issues',
      icon: <HelpCircle size={20} color="#14b8a6" />, // Teal
      iconBg: '#ccfbf1',
      href: '/support'
    },
    {
      id: 4,
      title: 'Logout',
      desc: 'Sign out of your account',
      icon: <LogOut size={20} color="#ef4444" />, // Red
      iconBg: '#fee2e2',
      href: '#'
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
      
      {/* Page Title */}
      <div className="desktop-only" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--royal-text-dark)', margin: 0 }}>More & Options</h1>
        <p style={{ fontSize: '14px', color: 'var(--royal-text-gray)', margin: '4px 0 0' }}>Manage your account and settings</p>
      </div>

      {/* Settings Layout */}
      <div style={{ 
        padding: '4px 0 0',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        {/* Action List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {menuOptions.map((option) => (
            <Link href={option.href} key={option.id} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white',
                border: '1px solid var(--royal-border)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
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
                
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
