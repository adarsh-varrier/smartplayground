import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // For navigation
import DashHead from "../reuse/header2";
import Sidebar from "../reuse/user-side";
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

const CustomerPlayg = () => {
    const [playgrounds, setPlaygrounds] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchPlaygrounds = async () => {
          try {
            const token = localStorage.getItem('authToken');
            console.log("Token:", token);
    
            if (!token) {
              console.error("No authentication token found!");
              return;
            }
    
            const response = await fetch('http://127.0.0.1:8000/api/playg-customer/', {
              method: 'GET',
              headers: {
                'Authorization': `Token ${token}`,
              },
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch playgrounds');
            }
    
            const data = await response.json();
            setPlaygrounds(data.results || data);
    
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPlaygrounds();
      }, []);

    return (
        <div>
            <div className='head-customer'>
                <DashHead />
            </div>
            <div className='dashboard-container'>
                <Sidebar />
                <div className='dashboard-content'>
                    <h2>Available Playgrounds</h2>

                    {loading ? (
                                <p className="text-center text-primary">Loading playgrounds...</p>
                              ) : error ? (
                                <p className="text-center text-danger">{error}</p>
                              ) : playgrounds.length === 0 ? (
                                <p className="text-center text-muted">No playgrounds registered yet.</p>
                              ) : (
                                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                  {playgrounds.map((playground) => (
                                    <div className="col" key={playground.id}>
                                      <Link to={`/playground-customer/${playground.id}`} className="text-decoration-none">
                                      
                                        <div className="card h-100 shadow-sm">
                                          <img
                                            src={`http://127.0.0.1:8000${playground.image}`}
                                            className="card-img-top"
                                            alt={playground.name}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                          />
                                          {console.log("de link",playground.image)}
                                          <div className="card-body">
                                            <h5 className="card-title text-dark">{playground.name}</h5>
                                            <p className="card-text">
                                              <strong>Location:</strong> {playground.location}
                                            </p>
                                            <p className="card-text">
                                              <strong>Lat:</strong> {playground.latitude}
                                            </p>                                            <p className="card-text">
                                              <strong>Long:</strong> {playground.longitude}
                                            </p>
                                            <p className="card-text">
                                              <strong>Type:</strong> {playground.platform_type}
                                            </p>
                                            <p className="card-text fw-bold text-success">
                                              ₹{playground.price}
                                            </p>
                                          </div>
                                        </div>
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              )}
                </div>
            </div>
        </div>
    );
};

export default CustomerPlayg;
