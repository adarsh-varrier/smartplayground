import React, { useEffect, useState, useCallback } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FaBell } from 'react-icons/fa';
import { MapPin } from "lucide-react";
import '../../styles/notification.css';


function DashHead() {
  const [username, setUsername] = useState('');
  const [user_id, setUserId] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("authToken");

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
        setUserId(data.user_id)
        localStorage.setItem("userId",data.user_id);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
      
  }, []);

    // Wrap fetchUnreadCount in useCallback to prevent re-creation
    const fetchUnreadCount = useCallback(() => {
      if (!token) return;

      axios.get("http://127.0.0.1:8000/api/notifications/unread-count/", {
          headers: { Authorization: `Token ${token}` }
      })
      .then(response => {
          setUnreadCount(response.data.unread_count);
      })
      .catch(error => {
          console.error("Error fetching unread notifications count:", error);
      });
  }, [token]); // ✅ Dependency added

  // Use useEffect with fetchUnreadCount as a dependency
  useEffect(() => {
      fetchUnreadCount(); // Fetch initially
      const interval = setInterval(fetchUnreadCount, 5000); // Fetch every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchUnreadCount]);

  return (
    <div>
        {console.log("user id:",user_id)}
        <div className='head-customer'>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <Link className="navbar-brand" to="/">SMARTPLAY</Link>  
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                      <li className="nav-item dropdown">
                        <Link 
                          className="nav-link dropdown-toggle" 
                          to="#" 
                          id="navbarDropdown" 
                          role="button" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false"
                        >
                          {username ? username : 'Loading...'}
                        </Link>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                          <li>
                            <Link className="dropdown-item" to="/settings">Profile</Link>
                          </li>
                          {userdetails && userdetails.user_type === 'Customer' ? 
                          <li>
                            <Link className="dropdown-item" to="/ticket">Ticket</Link>
                          </li> : null }
                          
                          <li>
                            <Link className="dropdown-item" to="/logout">Logout</Link>
                          </li>
                        </ul>
                      </li>
                      {userdetails && (userdetails.user_type === 'Customer' || userdetails.user_type === 'Owner') ? 
                      <li className="nav-item dropdown">
                        <Link className="nav-link position-relative" to="/notifications">
                          <FaBell />
                          {unreadCount > 0 && (
                          <span className="notifi-count">
                              {unreadCount}
                          </span>
                          )}
                        </Link>
                      </li>: null }
                      <li className="nav-item dropdown"><Link className="nav-link " 
                          to="/location" 
                          id="navbar" 
                          role="button"
                          aria-expanded="false" ><MapPin size={20} color="red" /></Link>
                      </li>
                    </ul>

                </div>
                </div>
            </nav>
        </div>
    </div>
  );
}

export default DashHead;
