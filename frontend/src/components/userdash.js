import React from 'react';
import Sidebar from './reuse/user-side';
import '../styles/user-dash.css';  
import '../styles/head-common.css'; 
 
import WeatherData from './reuse/weather';
import DashHead from './reuse/header2';
import RecentBooking from './reuse/recent-booking';
import PhysicalData from './reuse/physical';

function CustomerDashboard() {
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar/>
            <div className='dashboard-content'>
              <h2>Customer Dashboard</h2>            
                <div>
                  <WeatherData/>
                </div>
                <div>
                  <RecentBooking/>
                </div>
                <PhysicalData/>
            </div>
        </div>
    </div>
  );
}

export default CustomerDashboard;
