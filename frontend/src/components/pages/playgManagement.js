import React, { useEffect, useState } from "react";
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import axios from "axios"; 

import DashHead from '../reuse/header2';
import Sidebar3 from '../reuse/admin-side';
import { Link } from "react-router-dom";

function PlaygManagement() {
  const [playgrounds, setPlaygrounds] = useState([]);

    useEffect(() => {
        fetchPlaygrounds();
    }, []);

    const fetchPlaygrounds = async () => {
        try {
            const token = localStorage.getItem("authToken"); // Get token from local storage
            const response = await fetch("http://127.0.0.1:8000/api/playgrounds/", {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch playgrounds");
            }

            const data = await response.json();
            setPlaygrounds(data);  // Store fetched playgrounds
        } catch (error) {
            console.error("Error fetching playgrounds:", error);
        }
    };

    const deletePlayground = async (id) => {
      if (window.confirm("Are you sure you want to delete this playground?")) {
          try {
              const token = localStorage.getItem("authToken");
              await axios.delete(`http://127.0.0.1:8000/api/playgrounds/${id}/`,{
                headers: { Authorization: `Token ${token}` },
              });
              setPlaygrounds(playgrounds.filter(pg => pg.id !== id)); // Remove from state
          } catch (error) {
              console.error("Error deleting playground:", error);
          }
      }
  };
   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            <Sidebar3/>
            <div className='dashboard-content'>

              <div className="container-fluid">
                <h2 className="text-center my-4">Playground Management</h2>
                  <div className="table-responsive">
                      <table className="table table-striped table-bordered table-hover">
                          <thead className="table-dark">
                              <tr>
                                  <th>ID</th>
                                  <th>Name</th>
                                  <th>Location</th>
                                  <th>Latitude</th>
                                  <th>Longitude</th>
                                  <th>Platform Type</th>
                                  <th>Price</th>
                                  <th>Owner</th>
                                  <th>Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {playgrounds.map((pg) => (
                                  <tr key={pg.id}>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">{pg.id}</Link></td>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">{pg.name}</Link></td>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">{pg.location}</Link></td>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">{pg.latitude}</Link></td>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">{pg.longitude}</Link></td>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">{pg.platform_type}</Link></td>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">${pg.price}</Link></td>
                                      <td><Link to={`/playground/${pg.id}`} className="text-decoration-none">{pg.owner_name}</Link></td>
                                      <td className="text-center">
                                          <button 
                                              onClick={() => deletePlayground(pg.id)} 
                                              className="btn btn-danger btn-sm"
                                          >
                                              Delete
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
            </div>
        </div>
    </div>
  );
}

export default PlaygManagement;