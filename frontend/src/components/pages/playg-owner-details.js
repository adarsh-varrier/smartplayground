import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";  // Change to useNavigate
import DashHead from "../reuse/header2";
import Sidebar2 from "../reuse/owner-side";
import WeatherData2 from "../reuse/weather2";
import Sidebar3 from "../reuse/admin-side";
import ReviewComponent from "../reuse/review";
import '../../styles/playg-owner.css'; 


function PlaygroundDetail() {
    const { id } = useParams(); // Get the playground ID from the URL
    const navigate = useNavigate(); // For navigation after delete
    const [playground, setPlayground] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedPlayground, setUpdatedPlayground] = useState({
        name: '',
        location: '',
        platform_type: '',
        price: '',
        image: ''
    });
    const userToken = localStorage.getItem("authToken");
    useEffect(() => {
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
                setUpdatedPlayground(data); // Pre-fill the form with existing data
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaygroundDetail();
    }, [id]);

    const handleUpdateChange = (e) => {
        const { name, value, type, files } = e.target;
    
        setUpdatedPlayground((prevData) => ({
            ...prevData,
            [name]: type === "file" && files.length > 0 ? files[0] : value  // Only update if file is selected
        }));
    };    
    
    
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
    
        if (!token) {
            setError("Authentication token is missing");
            return;
        }
    
        const formData = new FormData();
    
        for (const key in updatedPlayground) {
            if (key === "image") {
                if (updatedPlayground[key] instanceof File) {
                    formData.append(key, updatedPlayground[key]); // Append only if it's a new file
                }
            } else {
                formData.append(key, updatedPlayground[key]);
            }
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/owner-playg/${id}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Token ${token}`,  // DO NOT set "Content-Type"
                },
                body: formData
            });
    
            const data = await response.json();
            console.log("Updated Data:", data);
    
            if (!response.ok) {
                throw new Error(`Failed to update playground: ${JSON.stringify(data)}`);
            }
    
            setPlayground(data);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating playground:", err.message);
            setError(err.message);
        }
    };
    
    
    const handleDelete = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setError("Authentication token is missing");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/owner-playg/${id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete playground");
            }

            navigate("/ownerplay"); // Redirect to another page after deletion
        } catch (err) {
            setError(err.message);
        }
    };
    const [userdetails, setUserDetails] = useState(null);
          useEffect(() => {
                  const token = localStorage.getItem('authToken');
                  if (!token) {
                      console.error("No token found, user is not logged in.");
                      return;
                  }
              
                  fetch('http://127.0.0.1:8000/api/settings/', {
                      method: 'GET',
                      headers: {
                      'Authorization': `Token ${token}`,
                      'Content-Type': 'application/json',
                  },
                  })
                      .then(response => response.json())
                      .then(data => {
                      setUserDetails(data);
                      })
                      .catch(error => {
                      console.error('Error fetching user data:', error);
                  });
          }, []);

    return (
        <div>
            <DashHead />
            <div className="dashboard-container">
            {userdetails && userdetails.user_type === 'Owner' ? <Sidebar2 /> : <Sidebar3 />}
                <div className="dashboard-content">
                    <div className="owner-view-container">
                    {console.log("playg-id",id)}
                        {userdetails && userdetails.user_type === "Owner" && (
                            <div className="d-flex justify-content-end mb-3">
                                    <Link to={`/ownerplay`} className="btn btn-outline-primary">
                                        Back
                                    </Link>
                            </div>
                        )}
                        {userdetails && userdetails.user_type !== "Owner" && (
                            <div className="d-flex justify-content-end mb-3">
                                    <Link to={`/PlaygManagement`} className="btn btn-outline-primary">
                                        Back
                                    </Link>
                            </div>
                        )}
                        <div className="owner-func">
                            {loading ? (
                                <p className="text-primary">Loading...</p>
                            ) : error ? (
                                <p className="text-danger">{error}</p>
                            ) : (
                                <div className="owner-playg-details">
                                    <img
                                        src={`http://127.0.0.1:8000${playground.image}`}
                                        className="owner-img-top"
                                        alt={playground.name}
                                        style={{ height: "300px", objectFit: "cover" }}
                                    />
                                    {isEditing ? (
                                        <div className="edit-form">
                                            <form onSubmit={handleUpdateSubmit} encType="multipart/form-data" className="owner-edit">
                                                <div className="owneredit-form-body">
                                                <h2 className="owner-edit-details">
                                                    <strong className="owner-feild">Location:</strong>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={updatedPlayground.name}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </h2>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Location:</strong>
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={updatedPlayground.location}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </p>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Address:</strong>
                                                    <textarea
                                                        name="address"
                                                        value={updatedPlayground.address}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    ></textarea>
                                                </p>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Time Slot Start:</strong>
                                                    <input
                                                        type="time"
                                                        name="time_slot_start"
                                                        value={updatedPlayground.time_slot_start}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </p>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Time Slot End:</strong>
                                                    <input
                                                        type="time"
                                                        name="time_slot_end"
                                                        value={updatedPlayground.time_slot_end}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </p>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Number of Players:</strong>
                                                    <input
                                                        type="number"
                                                        name="num_players"
                                                        value={updatedPlayground.num_players}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </p>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Platform Type:</strong>
                                                    <select
                                                        name="platform_type"
                                                        value={updatedPlayground.platform_type}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    >
                                                        <option value="football">Football Ground</option>
                                                        <option value="cricket">Cricket Ground</option>
                                                        <option value="park">Children’s Park</option>
                                                    </select>
                                                </p>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Price:</strong>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={updatedPlayground.price}
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                        required
                                                    />
                                                </p>
                                                <p className="owner-edit-details">
                                                    <strong className="owner-feild">Image:</strong>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        accept="image/*"
                                                        onChange={handleUpdateChange}
                                                        className="form-control"
                                                    />
                                                </p>
                                                <button type="submit" className="owner-edit-sub">Update</button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="owner-alter-option">
                                            <h2 className="owner-playg-details">{playground.name}</h2>
                                            <p className="owner-playg-details">
                                                <strong>Location:</strong> {playground.location}
                                            </p>
                                            <p className="owner-playg-details">
                                                <strong>Type:</strong> {playground.platform_type}
                                            </p>
                                            <p className="owner-playg-details">
                                                ₹{playground.price}
                                            </p>
                                            {userdetails && userdetails.user_type === "Owner" && (
                                                <>
                                                    <button className="btn-owner btn-warning" onClick={() => setIsEditing(true)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn-owner btn-danger ms-2" onClick={handleDelete}>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="owner-func">
                            {playground ? <WeatherData2 id={playground.id} /> : <p>Loading playground...</p>}
                        </div>
                        <div className="owner-func">
                            <ReviewComponent playgroundId={id} userToken={userToken} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaygroundDetail;
