"use client";

import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatCards from '../components/dashboard/StatCards';
import RecentOrders from '../components/dashboard/RecentOrders';
import BusinessOverview from '../components/dashboard/BusinessOverview';
import ProductPerformance from '../components/dashboard/ProductPerformance';
import Announcements from '../components/dashboard/Announcements';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <div className="dashboard-grid">
        <StatCards />
        
        <RecentOrders />
        
        <BusinessOverview />
        
        <div className="royal-card grow-section grow-card">
          <div className="grow-content">
            <h3>Grow with SwadDesh</h3>
            <p>Maintain quality, get good ratings and increase your sales.</p>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200" alt="Grow your business" className="grow-img" />
        </div>

        <Announcements />
        
        <ProductPerformance />
      </div>
    </div>
  );
};

export default Dashboard;
