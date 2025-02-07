// OwnerDashboard.js
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Sidebar3 from './reuse/admin-side';
import '../styles/user-dash.css';  
import '../styles/head-common.css'; 

function AdminDashboard() {
  const [username, setUsername] = useState('');
    
      useEffect(() => {
        // Fetch the logged-in user's details
        const token = localStorage.getItem('authToken');  // Get the token from localStorage
        console.log("Token being sent:", token);
    
        
        if (!token) {
          console.error("No token found, user is not logged in.");
          return;
        }
    
        // Fetch the user data from the backend
        fetch('http://127.0.0.1:8000/api/user-details/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,  // Attach the token for authentication
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setUsername(data.username);  // Set the username from the response data
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }, []);
  return (
    <div>
<div className='head-customer'>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <Link className="navbar-brand" to="/">SMARTPLAY</Link>  {/* Use Link for navigation */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link active" to="">{username ? username : 'Loading...'}</Link>  {/* Use Link for navigation */}
                    </li>
                    <li className="nav-item">
                    
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
      </div>
      <div className='dashboard-container'>
        <Sidebar3/>
        <div className='dashboard-content'>   
          <h1>Aauthorized Personnel only!!</h1>
            <p>Welcome, {username ? username : 'Loading...'}!</p> {/* Display the username */}
            {/* Owner-specific content */}
          </div>
        </div>
    </div>
  );
}

export default AdminDashboard;