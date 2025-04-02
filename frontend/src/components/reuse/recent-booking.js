import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../../styles/recent-game.css'; 

const RecentBooking = () => {
    const [recentBooking, setRecentBooking] = useState(null);
    const token = localStorage.getItem("authToken");  // Assuming JWT is stored in localStorage

    useEffect(() => {
        const fetchRecentBooking = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/check-recent-event/", {
                    headers: { Authorization:  `Token ${token}` },
                });

                console.log("API Response:", response.data);
                if (response.data.status === "success") {
                    setRecentBooking(response.data);
                } else {
                    setRecentBooking(null);
                }
            } catch (error) {
                console.error("Error fetching recent booking:", error);
                setRecentBooking(null);
            }
        };

        fetchRecentBooking();
    }, [token]);

    return (
        <div className="recent-booked-status">

            {recentBooking ? (
                <div className="recent-booked-event">
                    <h3 className="booked-status-head"> You have match today.</h3>
                    <p className="message-booked">Check the weather status of the location</p>
                    <ul>
                        <Link to={`/playground-customer/${recentBooking.playground_id}`} className="playground-link">
                            <li><img src={`http://127.0.0.1:8000${recentBooking.playground_image}`} alt={recentBooking.playground_name} className="playground-image" /></li>
                            <li>{recentBooking.playground_name}</li>
                            <li><p><strong>Ticket Number:</strong> {recentBooking.ticket_number}</p></li>
                            <li><p><strong>Date:</strong> {recentBooking.date}</p></li>
                            <li><p><strong>Time Slot:</strong> {recentBooking.time_slot}</p></li>
                        </Link>
                    </ul>

                </div>
            ) : (
                <p className="message-booked">No bookings in the last 24 hours.</p>
            )}
        </div>
    );
};

export default RecentBooking;
