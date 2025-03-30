import React from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import '../../styles/games.css'; 

import DashHead from '../reuse/header2';
import { Link } from 'react-router-dom';

function Wordle() {
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar/>
            <div className='dashboard-content'>
                          <div className="back-btn">
                            <Link to={`/Games`} className="game-back-btn">
                                Back
                            </Link>
                          </div>
                <h2 className='game-head'>Wordle</h2>
                <ul className='gane-start'>
                    <li className='nested-game'>
                    <Link className='link-to-game' to="/wordleplay">Start Game</Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
}

export default Wordle;