import React from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
 

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
            <div className='dashboard-content text-center p-4 bg-light rounded shadow'>
                          <div className="d-flex justify-content-end mb-3">
                            <Link to={`/Games`} className="btn btn-outline-primary">
                                Back
                            </Link>
                          </div>
                <h2 className='mb-4 display-4 text-primary'>Wordle</h2>
                <ul className='list-unstyled'>
                    <li className='mb-3'>
                    <Link className='btn btn-outline-success btn-lg w-25' to="/wordleplay">Start Game</Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
}

export default Wordle;