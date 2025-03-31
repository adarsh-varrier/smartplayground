import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashHead from "../reuse/header2";
import Sidebar from "../reuse/user-side";
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import '../../styles/playglist.css'; 

const CustomerPlayg = () => {
    const [playgrounds, setPlaygrounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    const fetchPlaygrounds = async (search = "") => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                console.error("No authentication token found!");
                return;
            }
            
            // Construct URL with search parameter if it exists
            let url = 'http://127.0.0.1:8000/api/playg-customer/';
            if (search) {
                url += `?search=${encodeURIComponent(search)}`;
            }
            
            const response = await fetch(url, {
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
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaygrounds();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPlaygrounds(searchTerm);
    };
    
    const handleClearSearch = () => {
        setSearchTerm("");
        fetchPlaygrounds();
    };

    return (
        <div>
            <div className='head-customer'>
                <DashHead />
            </div>
            <div className='dashboard-container'>
                <Sidebar />
                <div className='dashboard-content'>
                    <div className="container">
                        <div className="main-head">
                            <h2>Available Playgrounds</h2>
                            <div className="playg-search-field">
                              <form onSubmit={handleSearch} className="search-form-playg">
                                  <div className="search-container-playg">
                                      <input
                                          type="text"
                                          placeholder="Search by name or location..."
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)}
                                          className="search-input"
                                      />
                                      <button type="submit" className="search-button-playg">
                                          Search
                                      </button>
                                      {searchTerm && (
                                          <button 
                                              type="button" 
                                              onClick={handleClearSearch}
                                              className="clear-button"
                                          >
                                              Clear
                                          </button>
                                      )}
                                  </div>
                              </form>
                            </div>
                        </div>
                        <div className="playgrounds">
                            {loading ? (
                                <p className="text-center text-primary">Loading playgrounds...</p>
                            ) : error ? (
                                <p className="text-center text-danger">{error}</p>
                            ) : playgrounds.length === 0 ? (
                                <p className="text-center text-muted">
                                    {searchTerm 
                                        ? "No playgrounds match your search criteria." 
                                        : "No playgrounds registered yet."}
                                </p>
                            ) : (
                                <div className="Playg-list">
                                    {playgrounds.map((playground) => (
                                        <div className="playg" key={playground.id}>
                                            <Link to={`/playground-customer/${playground.id}`} className="item">
                                                <div className="card-playg">
                                                    <img
                                                        src={`http://127.0.0.1:8000${playground.image}`}
                                                        className="card-img-top"
                                                        alt={playground.name}
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{playground.name}</h5>
                                                        <p className="card-details">
                                                            <strong>Location:</strong> {playground.location}
                                                        </p>
                                                        <p className="card-details">
                                                            <strong>Type:</strong> {playground.platform_type}
                                                        </p>
                                                        <p className="card-details">
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
            </div>
        </div>
    );
};

export default CustomerPlayg;