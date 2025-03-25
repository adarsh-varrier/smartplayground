import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashHead from "../reuse/header2";
import Sidebar from "../reuse/user-side";
import WeatherData2 from '../reuse/weather2';
import ReviewComponent from '../reuse/review';

function PlaygroundDetail2() {
    const { id } = useParams();  // Access the playground ID from the URL
    const [playground, setPlayground] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state
    const [error, setError] = useState(null);  // Add error state
    const userToken = localStorage.getItem("authToken");

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

    return (
            <div>
                <DashHead />
                <div className="dashboard-container">
                    <Sidebar />
                    <div className="dashboard-content">
                        <p className="text-center display-4">Playground Details</p>
                            <div className="d-flex justify-content-end mb-3">
                                <Link to={`/playglist`} className="btn btn-outline-primary">
                                    Back
                                </Link>
                            </div>
        
                        {/* Show Loading Message */}
                        {loading && <p className="text-center">Loading playground details...</p>}
        
                        {/* Show Error Message */}
                        {error && <p className="text-center text-danger">{error}</p>}
        
                        {!loading && !error && playground && (
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
                                </div>
                                <div>
                                    <WeatherData2 id={playground.id} />
                                </div>
                                <div className="text-center mt-4">
                                    <Link 
                                        to={`/playground-customer-booking/${playground.id}`} 
                                        className="btn btn-primary btn-lg shadow-sm px-4 py-2"
                                    >
                                        <i className="fas fa-calendar-check me-2"></i> Book Playground
                                    </Link>
                                </div>
                                <div>
                                    <ReviewComponent playgroundId={id} userToken={userToken} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    );
        
}

export default PlaygroundDetail2;
