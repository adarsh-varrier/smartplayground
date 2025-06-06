import React, { useEffect, useState } from 'react';
import DashHead from '../reuse/header2';
import Sidebar from '../reuse/user-side';
import '../../styles/ticket.css';

function Ticket() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const userId = localStorage.getItem('userId');
          console.log("Token:", token);
          console.log("uid:", userId);
  
          if (!token) {
            console.error("No authentication token found!");
            return;
          }
  
          const response = await fetch('http://127.0.0.1:8000/api/bookings/', {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch playgrounds');
          }
  
          const data = await response.json();
          setBookings(data.results || data);
  
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
    fetchBookingDetails();
  }, []);  // Empty dependency array to run once when the component mounts
  
  return (
    <div>
      <div className='head-customer'>
        <DashHead />
      </div>
      <div className='dashboard-container'>
        <Sidebar />
        <div className='dashboard-content'>
          <div className="tickets">
              <h2 className="ticket-head">Your Booking Ticket</h2>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : bookings.length === 0 ? (
                <p className="text-warning">No bookings found.</p>
              ) : (
                <div className="ticket-row">
                  {bookings.map((booking, index) => (
                    <div key={index} className="ticket-col">
                      <div className="ticket-card">
                        <div className="ticket-body">
                          <h5 className="ticket-number">
                            🎟️ Ticket #{booking.ticket_number}
                          </h5>
                          <hr className="dashed-line" />
                          <p>
                            <strong>Playground:</strong> {booking.playground}
                          </p>
                          <p>
                            <strong>Time Slot:</strong> {booking.time_slot}
                          </p>
                          <p>
                            <strong>Date:</strong> {booking.date}
                          </p>
                          <p>
                            <strong>Players:</strong> {booking.num_players}
                          </p>
                        </div>
                        <div className="ticket-footer">
                          <p className="small text-muted">📌 Keep this ticket for entry</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
