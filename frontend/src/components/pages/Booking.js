import React from 'react';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import Sidebar2 from '../reuse/owner-side';
import Confirmation from './confirmation';

function BookingView() {
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar2/>
            <div className='dashboard-content'>
              <h2>Booking</h2>
              <div>
                <Confirmation/>
              </div>
            </div>
        </div>
    </div>
  );
}

export default BookingView;