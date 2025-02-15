import React from 'react';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import Sidebar2 from '../reuse/owner-side';

function Childplay2() {
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar2/>
            <div className='dashboard-content'>
              <h2>Child play Owner set up</h2>
            </div>
        </div>
    </div>
  );
}

export default Childplay2;