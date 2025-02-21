import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaTachometerAlt, FaChild, FaFootballBall } from 'react-icons/fa';
import '../../styles/user-nav.css';
import LogoutButton from './Logout';

function Sidebar2() {
  return (
    <div className="sidebar">
      <ul>
        <li className='path'>
          <Link to="/Owner-dashboard">
            <FaTachometerAlt /> dashboard
          </Link>
        </li>
        <li className='path'>
          <Link to="/ownerplay">
          <FaFootballBall /> Playgrounds
          </Link>
        </li>
        <li className='path'>
          <Link to="/childplay-owner">
            <FaChild /> Together
          </Link>
        </li>
        <li className='path'>
          <Link to="/FAQ">
            <FaComments /> FAQ
          </Link>
        </li>
        <li className='path'>
          <Link to="">
            <LogoutButton/> 
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar2;
