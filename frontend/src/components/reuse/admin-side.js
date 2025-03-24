import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaChild, FaFootballBall, FaComments } from 'react-icons/fa';
import '../../styles/user-nav.css';
import LogoutButton from './Logout';
import Chatbot from '../chatbot';

function Sidebar3() {
  return (
    <div className="sidebar">
      <ul>
        <li className='path'>
          <Link to="/admin-dashboard">
            <FaTachometerAlt /> dashboard
          </Link>
        </li>
        <li className='path'>
          <Link to="/UserManagement">
          <FaFootballBall /> Users
          </Link>
        </li>
        <li className='path'>
          <Link to="/PlaygManagement">
            <FaChild /> Playground 
          </Link>
        </li>
        <li className='path'>
          <Link to="/FAQadmin">
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

export default Sidebar3;
