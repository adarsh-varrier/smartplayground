import React from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';

function Childplay() {
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar/>
            <div className='dashboard-content'>
              <h2>Child play set up</h2>
            </div>
        </div>
    </div>
  );
}

export default Childplay;