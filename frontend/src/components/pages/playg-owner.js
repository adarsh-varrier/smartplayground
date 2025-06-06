import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar2 from '../reuse/owner-side';
import DashHead from '../reuse/header2';
import '../../styles/playglist.css'; 

function Ownerplay() {
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

        const response = await fetch('http://127.0.0.1:8000/api/owner-playg/', {
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
      <DashHead />
      <div className="dashboard-container">
        <Sidebar2 />
        <div className="dashboard-content">
          <h3>My Playgrounds</h3>
          <div className="text-start my-3">
              <Link to="/play-registration" className="btn btn-success btn-lg shadow-sm">
                  <i className="fas fa-plus-circle me-2"></i> Add Playground
              </Link>
          </div>
          <div className="playgrounds">

              {loading ? (
              <p className="text-center text-primary">Loading playgrounds...</p>
              ) : error ? (
                <p className="text-center text-danger">{error}</p>
              ) : playgrounds.length === 0 ? (
                <p className="text-center text-muted">No playgrounds registered yet.</p>
              ) : (
              <div className="Playg-list">
                {playgrounds.map((playground) => (
                  <div className="playg" key={playground.id}>
                    <Link to={`/playground/${playground.id}`} className="item">
                    
                      <div className="card-playg">
                        <img
                          src={`http://127.0.0.1:8000${playground.image}`}
                          className="card-img-top"
                          alt={playground.name}
                          style={{ height: '200px', objectFit: 'cover' }}
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
  );
}

export default Ownerplay;