import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Confirmation() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError("Authentication required. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/confirmation/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
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
  }, []);

  const updateBookingStatus = async (ticketNumber, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`http://127.0.0.1:8000/api/update-booking/${ticketNumber}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Update UI without reloading
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.ticket_number === ticketNumber ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">
        <h2 className="text-center text-success">Booked Users for Your Playgrounds</h2>

        {loading && <p className="text-center text-info fw-bold">Loading bookings...</p>}
        {error && <p className="text-center text-danger fw-bold">{error}</p>}

        {!loading && !error && bookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Ticket #</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Playground</th>
                  <th>Time Slot</th>
                  <th>Date</th>
                  <th>Players</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.ticket_number}>
                    <td>{booking.ticket_number}</td>
                    <td>{booking.customer_name}</td>
                    <td>{booking.customer_email}</td>
                    <td>{booking.customer_phone || 'N/A'}</td>
                    <td>{booking.playground}</td>
                    <td>{booking.time_slot}</td>
                    <td>{booking.date}</td>
                    <td>{booking.num_players}</td>
                    <td>
                      <span
                        className={`badge ${
                          booking.status === "Confirmed"
                            ? "bg-success"
                            : booking.status === "Rejected"
                            ? "bg-danger"
                            : "bg-warning"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                  
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => updateBookingStatus(booking.ticket_number, "Confirmed")}
                          >
                            Confirm
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => updateBookingStatus(booking.ticket_number, "Rejected")}
                          >
                            Reject
                          </button>
                        </>
                      
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="text-center text-muted">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default Confirmation;
