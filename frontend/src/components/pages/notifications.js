import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import Sidebar2 from "../reuse/owner-side";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) {
            console.error("No token found, user is not logged in.");
            return;
        }
    
        axios.get("http://127.0.0.1:8000/api/notifications/", {  // ✅ Missing comma fixed
            headers: {
                Authorization: `Token ${token}`
            }
        }) 
        .then(response => setNotifications(response.data))
        .catch(error => console.error("Error fetching notifications:", error));
    }, [token]);

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

    const deleteNotification = async (notificationId) => {
        const token = localStorage.getItem("authToken");
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/notifications/${notificationId}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            if (response.ok) {
                setNotifications((prevNotifications) =>
                    prevNotifications.filter((notif) => notif.id !== notificationId)
                ); // ✅ Remove deleted notification from state
                console.log("Notification deleted successfully");
            } else {
                console.error("Failed to delete notification");
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };
    

  return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
        {userdetails && userdetails.user_type === 'Customer' ? <Sidebar /> : <Sidebar2 />}
            <div className='dashboard-content'>
            <h3>Notifications</h3>
            <ul>
                {notifications.map((notif, index) => (
                <li key={index}>
                    {notif.message} <small>({new Date(notif.created_at).toLocaleString()})</small>
                    {console.log("notifcation id:",notif.id)}
                    <button onClick={() => deleteNotification(notif.id)}>Delete</button>
                </li>
                ))}
            </ul>
            </div>
        </div>
    </div>
  );
}

export default Notifications;
