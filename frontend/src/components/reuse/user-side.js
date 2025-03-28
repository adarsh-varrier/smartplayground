import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaTachometerAlt, FaChild, FaGamepad, FaFootballBall } from 'react-icons/fa';
import '../../styles/user-nav.css';
import LogoutButton from './Logout';
import Chatbot from '../chatbot';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li className='path'>
          <Link to="/customer-dashboard">
            <FaTachometerAlt /> dashboard
          </Link>
        </li>
        <li className='path'>
          <Link to="/playglist">
          <FaFootballBall /> Playgrounds
          </Link>
        </li>
        <li className='path'>
          <Link to="/childplay">
            <FaChild /> Physical
          </Link>
        </li>
        <li className='path'>
          <Link to="/Games">
            <FaGamepad /> Games
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
        <Chatbot/>
      </ul>
    </div>
  );
}

export default Sidebar;
