import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashHead from "../reuse/header2";
import Sidebar2 from "../reuse/owner-side";

function PlaygroundDetail() {
    const { id } = useParams(); // Get the playground ID from the URL
    const [playground, setPlayground] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      console.log("Fetching details for:", id);  // Debugging ID
  
      const fetchPlaygroundDetail = async () => {  // No need for `id` parameter
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
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPlaygroundDetail(); // Call function
  
    }, [id]); 
  return (
    <div>
      <DashHead />
        <div className="dashboard-container">
            <Sidebar2 />
            <div className="dashboard-content">
                <div className="container mt-4">
                {loading ? (
                    <p className="text-primary">Loading...</p>
                ) : error ? (
                    <p className="text-danger">{error}</p>
                ) : (
                    <div className="card shadow-lg">
                    <img
                        src={`http://127.0.0.1:8000${playground.image}`}
                        className="card-img-top"
                        alt={playground.name}
                        style={{ height: "300px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                        <h2 className="card-title">{playground.name}</h2>
                        <p className="card-text"><strong>Location:</strong> {playground.location}</p>
                        <p className="card-text"><strong>Type:</strong> {playground.platform_type}</p>
                        <p className="card-text text-success fw-bold">₹{playground.price}</p>
                    </div>
                    </div>
                )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default PlaygroundDetail;
