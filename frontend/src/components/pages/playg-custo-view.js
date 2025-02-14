import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashHead from "../reuse/header2";
import Sidebar from "../reuse/user-side";

function PlaygroundDetail2() {
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
        if (bookedSlots && bookedSlots.some(slot => slot.date === date && slot.time_slot === time_slot)) {
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

            if (!response.ok) {
                throw new Error("Booking failed. Please check the form and try again.");
            }

            const data = await response.json();
            setMessage(data.message);
            setErrorMessage('');
        } catch (error) {
            setMessage('');
            setErrorMessage(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;  // Show loading message until data is fetched
    }

    if (error) {
        return <div>{error}</div>;  // Show error message if there is an error
    }

    // Disable past dates for the date picker
    const currentDate = new Date().toISOString().split("T")[0];  // Get today's date

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
            <DashHead />
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard-content">
                    <p className="text-center display-4">Playground Details</p>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-4">
                                <img
                                    src={`http://127.0.0.1:8000${playground.image}`}
                                    alt={playground.name}
                                    className="img-fluid rounded shadow"
                                />
                            </div>
                            <div className="col-md-8">
                                <h1 className="display-5">{playground.name}</h1>
                                <p><strong>Location:</strong> {playground.location}</p>
                                <p><strong>Address:</strong> {playground.address}</p>
                                <p><strong>Platform:</strong> {playground.platform_type}</p>
                                <p><strong>Price:</strong> {playground.price}</p>
                                <p><strong>Available Time Slot:</strong> {playground.time_slot_start} to {playground.time_slot_end}</p>
                                <p><strong>Number of Players:</strong> {playground.num_players}</p>
                            </div>
                            <div className="col-md-12">
                                <h3>Book this Playground</h3>
                                {message && <div className="alert alert-success">{message}</div>}
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                <form onSubmit={handleBooking}>
                                    <div className="form-group">
                                        <label htmlFor="date">Date</label>
                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            className="form-control"
                                            value={bookingData.date}
                                            onChange={handleChange}
                                            required
                                            min={currentDate}  // Prevent selecting past dates
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="time_slot">Time Slot</label>
                                        <select
                                            id="time_slot"
                                            name="time_slot"
                                            className="form-control"
                                            value={bookingData.time_slot}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Time Slot</option>
                                            {availableTimeSlots.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="num_players">Number of Players</label>
                                        <input
                                            type="number"
                                            id="num_players"
                                            name="num_players"
                                            className="form-control"
                                            min="1"
                                            max={playground.num_players}
                                            value={bookingData.num_players}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Book Now</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaygroundDetail2;
