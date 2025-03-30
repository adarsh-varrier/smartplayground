import React from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import PhysicalData from '../reuse/physical';
import GfitSignOut from '../reuse/Gfit-signout';
import PhysicalSuggesion from '../reuse/physicalsuggesion';

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
                  <div>
                    <PhysicalSuggesion/>
                  </div>
                  <div>
                    <GfitSignOut/>
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default PhysicalView;