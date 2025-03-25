import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css';
import '../../styles/booking.css';
 

import DashHead from '../reuse/header2';

function Playgbooking() {
    const { id } = useParams();  // Access the playground ID from the URL
    const [playground, setPlayground] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state
    const [error, setError] = useState(null);  // Add error state
    const [bookingData, setBookingData] = useState({
        date: '',
        time_slot: '',
        num_players: 1,
    });
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]); // Holds the already booked slots

    useEffect(() => {
        // Fetch the playground details from the backend using the id
        const fetchPlaygroundDetail = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await fetch(`http://127.0.0.1:8000/api/owner-playg/${id}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch playground details");
                }

                const data = await response.json();
                setPlayground(data);
            } catch (err) {
                setError(err.message);  // Set the error message in the state
            } finally {
                setLoading(false);  // Set loading to false after the fetch is complete
            }
        };

        fetchPlaygroundDetail();
    }, [id]);

    useEffect(() => {
        // Fetch already booked slots from the backend
        const fetchBookedSlots = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("No authentication token found");
                }
    
                const response = await fetch(`http://127.0.0.1:8000/api/playgrounds/${id}/booked-slots/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                
                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error("Failed to fetch booked slots: ", errorMessage);
                    throw new Error("Failed to fetch booked slots");
                }
                
                const data = await response.json();
                setBookedSlots(data.booked_slots || []);  // Ensure bookedSlots is an array, default to empty if undefined
            } catch (err) {
                setErrorMessage(err.message);  // Set the error message in the state
            }
        };
    
        fetchBookedSlots();
    }, [id]);
    

    // Handle form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle the booking submission
    // Handle the booking submission
    const handleBooking = async (e) => {
        e.preventDefault();
        const { date, time_slot, num_players } = bookingData;
        const token = localStorage.getItem("authToken");

        // Check if bookedSlots is defined and if the time slot is already booked
        if (bookedSlots && bookedSlots.some(slot => 
            new Date(slot.date).toISOString().split("T")[0] === date && 
            slot.time_slot === time_slot
        )) {
            setErrorMessage("The selected time slot is already booked.");
            setMessage('');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/playgrounds/${id}/book/`, {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    date,
                    time_slot,
                    num_players,
                })
            });

            const data = await response.json();
            if (!response.ok) {
                if (data.error) {  // 🔹 Read the actual error message
                    setErrorMessage(data.error);
                } else {
                    setErrorMessage("Booking failed. Please check the form and try again.");
                }
                setMessage('');
                return;
            }
            
            setMessage(data.message);
            setErrorMessage('');
        } catch (error) {
            setMessage('');
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;  // Show loading message until data is fetched
    }

    if (error) {
        return <div>{error}</div>;  // Show error message if there is an error
    }

    // Disable time slots that are in the past based on the selected date
    const availableTimeSlots = ["10:00-12:00", "14:00-16:00", "17:00-19:00", "20:00-22:00"].filter(slot => {
        const startTime = parseInt(slot.split(":")[0]);

        const selectedDate = new Date(bookingData.date);
        const today = new Date();

        // Check if the selected date is today or in the future
        if (selectedDate.toDateString() === today.toDateString()) {
            // If the date is today, check the time slot against the current time
            const currentTime = today.getHours();
            return startTime >= currentTime;
        }

        // If the date is in the future, all time slots are available
        return true;
    });
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar/>
            <div className="dashboard-content">
                    <p className="text-center display-4">Playground Details</p>
                    <div className="d-flex justify-content-end mb-3">
                        <Link to={`/playground-customer/${playground.id}`} className="btn btn-outline-primary">
                            Back
                        </Link>
                    </div>

                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-6">
                                <img
                                    src={`http://127.0.0.1:8000${playground.image}`}
                                    alt={playground.name}
                                    className="img-fluid rounded shadow"
                                />
                            </div>
                            <div className="col-md-8">
                                <div className='details-book'>
                                <h1 className="display-5">{playground.name}</h1>
                                <p><strong>Location:</strong> {playground.location}</p>
                                <p><strong>Price:</strong> {playground.price}</p>
                                <p><strong>Available Time Slot:</strong> {playground.time_slot_start} to {playground.time_slot_end}</p>
                                <p><strong>Number of Players:</strong> {playground.num_players}</p>
                                </div>
                            </div>
                            <div className="col-md-12">
                                
                                {message && <div className="alert alert-success">{message}</div>}
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                <form onSubmit={handleBooking}>
                                <div className="form-group">
                                <strong><label htmlFor="date" className="font-weight-bold">Select Date</label></strong>
                                        <div className="d-flex flex-wrap">
                                            {Array.from({ length: 7 }).map((_, index) => {
                                                const date = new Date();
                                                date.setDate(date.getDate() + index);
                                                const formattedDate = date.toISOString().split("T")[0];
                                                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                                                const month = date.toLocaleDateString('en-US', { month: 'short' });
                                                const dateNum = date.getDate();

                                                return (
                                                    <div key={formattedDate} className="date-option">
                                                        <input
                                                            type="radio"
                                                            id={`date-${formattedDate}`}
                                                            name="date"
                                                            value={formattedDate}
                                                            checked={bookingData.date === formattedDate}
                                                            onChange={handleChange}
                                                            className="d-none"
                                                        />
                                                        <label htmlFor={`date-${formattedDate}`} className={`date-box ${bookingData.date === formattedDate ? 'selected' : ''}`}>
                                                            <div className="day">{day}</div>
                                                            <div className="date">{dateNum}</div>
                                                            <div className="month">{month}</div>
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <strong><label className="font-weight-bold">Select Time Slot</label></strong>
                                        <div className="d-flex flex-wrap">
                                            {availableTimeSlots.map((slot) => (
                                                <div key={slot} className="time-option">
                                                    <input
                                                        type="radio"
                                                        id={`time-${slot}`}
                                                        name="time_slot"
                                                        value={slot}
                                                        checked={bookingData.time_slot === slot}
                                                        onChange={handleChange}
                                                        className="d-none"
                                                    />
                                                    <label htmlFor={`time-${slot}`} className={`time-box ${bookingData.time_slot === slot ? 'selected' : ''}`}>
                                                        {slot}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                    <strong><label htmlFor="num_players" className="font-weight-bold">Number of Players</label></strong>
                                        <div className="player-input-container">
                                            <button
                                                type="button"
                                                className="player-btn"
                                                onClick={() => setBookingData((prev) => ({
                                                    ...prev,
                                                    num_players: Math.max(1, prev.num_players - 1),
                                                }))}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                id="num_players"
                                                name="num_players"
                                                className="player-input"
                                                min="1"
                                                max={playground.num_players}
                                                value={bookingData.num_players}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="player-btn"
                                                onClick={() => setBookingData((prev) => ({
                                                    ...prev,
                                                    num_players: Math.min(playground.num_players, prev.num_players + 1),
                                                }))}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="btn-book">
                                        <button type="submit" className="btn btn-primary">Book Now</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
  );
}

export default Playgbooking;