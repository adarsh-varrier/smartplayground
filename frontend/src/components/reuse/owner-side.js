import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaComments, FaTachometerAlt, FaChild, FaGamepad, FaFootballBall, FaBell } from 'react-icons/fa';
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
          <Link to="/settings">
          <FaFootballBall /> Playgrounds
          </Link>
        </li>
        <li className='path'>
          <Link to="/settings">
            <FaChild /> Child play
          </Link>
        </li>
        <li className='path'>
          <Link to="/settings">
            <FaGamepad /> Games
          </Link>
        </li>
        <li className='path'>
          <Link to="/settings">
            <FaBell /> Notification
          </Link>
        </li>
        <li className='path'>
          <Link to="/settings">
            <FaCog /> Settings
          </Link>
        </li>
        <li className='path'>
          <Link to="/feedback">
            <FaComments /> Feedback
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
