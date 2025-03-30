import React from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import '../../styles/games.css'; 
 

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
              <div className='games'>
                <h2 className='game-head'>Let's Play</h2>
                <ul className='game-list'>
                  <li className='gameplay'>
                    <Link className='game' to="/XOXO"> XOXO</Link>
                  </li>
                  <li className='gameplay'>
                    <Link className='game' to="/wordle"> Wordle</Link>
                  </li>
                  <li className='gameplay'>
                    <Link className='game' to="/Ninja"> Ninja</Link>
                  </li>
                </ul>
              </div>
            </div>
        </div>
    </div>
  );
}

export default Games;