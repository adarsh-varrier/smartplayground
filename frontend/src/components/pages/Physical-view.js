import React from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import PhysicalData from '../reuse/physical';

function PhysicalView() {
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar/>
            <div className='dashboard-content'>
              <h2>Physical Status</h2>
              <div>                
                  <div>
                    <PhysicalData/>
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default PhysicalView;