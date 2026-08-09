import React from 'react';
import { Info, Home, Calendar } from 'lucide-react';

const Announcements = () => {
  return (
    <div className="royal-card grow-section">
      <div className="section-header">
        <h3>Announcements</h3>
        <a href="#" className="view-all">View All</a>
      </div>
      <div className="announcements-list">
        <div className="announcement-item">
          <div className="announcement-icon" style={{color: '#28a745', background: '#d4edda'}}>
            <Info size={16} />
          </div>
          <div className="announcement-content">
            <h5>New packaging guidelines updated</h5>
            <p>Please review the new packaging standards.</p>
          </div>
          <span className="announcement-time">2 days ago</span>
        </div>

        <div className="announcement-item">
          <div className="announcement-icon" style={{color: '#e74c3c', background: '#fce4e4'}}>
            <Home size={16} />
          </div>
          <div className="announcement-content">
            <h5>Payout for last week completed</h5>
            <p>Your payout of ₹8,430 has been processed.</p>
          </div>
          <span className="announcement-time">3 days ago</span>
        </div>

        <div className="announcement-item">
          <div className="announcement-icon" style={{color: '#e67e22', background: '#fcf3eb'}}>
            <Calendar size={16} />
          </div>
          <div className="announcement-content">
            <h5>Holiday notice: Warehouse closed on 15th May</h5>
            <p>Plan your shipments accordingly.</p>
          </div>
          <span className="announcement-time">5 days ago</span>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
