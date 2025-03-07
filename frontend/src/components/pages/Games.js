import React from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
 

import DashHead from '../reuse/header2';
import { Link } from 'react-router-dom';

function Games() {
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar/>
            <div className='dashboard-content'>
            <div className='game-content text-center p-4 bg-light rounded shadow'>
              <h2 className='mb-4 display-4 text-primary'>Let's Play</h2>
              <ul className='list-unstyled'>
                <li className='mb-3'>
                  <Link className='btn btn-outline-primary btn-lg w-50' to="/XOXO"> XOXO</Link>
                </li>
              </ul>
            </div>
            </div>
        </div>
    </div>
  );
}

export default Games;