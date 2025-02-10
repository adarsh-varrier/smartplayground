// OwnerDashboard.js
import React from 'react';
import Sidebar2 from './reuse/owner-side';
import DashHead from './reuse/header2';
import '../styles/user-dash.css'; 
import '../styles/head-common.css'; 
import WeatherData from './reuse/weather';

function OwnerDashboard() {
  return (
    <div>
      <div className='head-customer'>
        <DashHead/>
      </div>
      <div className='dashboard-container'>
        <Sidebar2/>
        <div className='dashboard-content'>   
          <h1>Owner Dash</h1>
        
            {/* Owner-specific content */}
            <div>
              <WeatherData/>
            </div>
          </div>
        </div>
    </div>
  );
}

export default OwnerDashboard;
