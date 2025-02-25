import React, { useState, useEffect } from "react";
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import Sidebar2 from '../reuse/owner-side';
import StarRating from "../reuse/rating";

function FAQ() {

    const [userdetails, setUserDetails] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error("No token found, user is not logged in.");
          return;
        }
    
        fetch('http://127.0.0.1:8000/api/settings/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
        })
          .then(response => response.json())
          .then(data => {
            setUserDetails(data);
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, []);

   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            {userdetails && userdetails.user_type === 'Customer' ? <Sidebar /> : <Sidebar2 />}
            <div className='dashboard-content'>
              <h2>FAQ</h2>
              <div><StarRating/></div>

            </div>
        </div>
    </div>
  );
}

export default FAQ;