import React from 'react';
import Link from 'next/link';

const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <div className="welcome-text">
        <h1>Namaste, Vendor! 👏</h1>
        <p>Manage your products, orders and grow your business with us.</p>
      </div>
      
      <div className="user-profile">
        <Link href="/notifications" className="notification-bell">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6E5A53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <div className="notification-dot"></div>
        </Link>
        <Link href="/profile" className="profile-info" style={{ textDecoration: 'none' }}>
          <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=140&q=80" alt="Bihari Thekua Ghar" className="profile-img" />
          <div className="profile-details">
            <h4>Bihari Thekua Ghar</h4>
            <p>Vendor ID: VDR12345</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6E5A53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
