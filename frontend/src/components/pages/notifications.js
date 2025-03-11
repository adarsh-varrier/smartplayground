import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import Sidebar2 from "../reuse/owner-side";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const token = localStorage.getItem("authToken");

    
    // Function to mark notifications as read
    const markNotificationsAsRead = useCallback(async () => {
        try {
            await axios.patch("http://127.0.0.1:8000/api/notifications/mark-read/", {}, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            // ✅ Update the state to mark notifications as read
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) => ({ ...notif, is_read: true }))
            );

            console.log("Notifications marked as read");
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    }, [token]);  // ✅ Added dependency to ensure it's stable

    useEffect(() => {
        if (!token) {
            console.error("No token found, user is not logged in.");
            return;
        }
    
        axios.get("http://127.0.0.1:8000/api/notifications/", {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(response => {
            console.log("Notifications fetched:", response.data);  // Debugging
            setNotifications(response.data);
            markNotificationsAsRead();
        })
        .catch(error => console.error("Error fetching notifications:", error));
    }, [token, markNotificationsAsRead]);

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
                <div className="container mt-4">
                    <h3 className="text-primary fw-bold mb-3">Notifications</h3>

                    {notifications.length === 0 ? (
                        <div className="alert alert-info text-center">No new notifications</div>
                    ) : (
                        <ul className="list-group">
                            {notifications.map((notif, index) => (
                                <li key={index} className={`list-group-item d-flex justify-content-between align-items-center ${notif.is_read ? 'text-muted' : 'fw-bold'}`}>
                                    <div>
                                        <p className="mb-1">{notif.message} {notif.is_read && "✔"}</p>
                                        <small className="text-muted">{new Date(notif.created_at).toLocaleString()}</small>
                                    </div>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteNotification(notif.id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default Notifications;
