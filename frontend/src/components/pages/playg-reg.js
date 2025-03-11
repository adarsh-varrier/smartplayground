import React, { useState } from 'react';
import Sidebar2 from '../reuse/owner-side';
import DashHead from '../reuse/header2';

function PlaygroundRegister() {
  // State to manage the form data
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    time_slot_start: '',
    time_slot_end: '',
    num_players: '',
    platform_type: 'football', // Default value
    image: null,
    price: '',
  });

  // State to manage API response or errors
  const [responseMessage, setResponseMessage] = useState('');

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to send data as multipart form
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem('authToken'); 
      console.log("Token:", token);
  
      if (!token) {
          console.error("No authentication token found!");
          setResponseMessage("Authentication failed. Please log in again.");
          return;
      }
  
      // Make the API request to register the playground
      const response = await fetch('http://127.0.0.1:8000/api/playg-register/', {
          method: 'POST',
          headers: {
              'Authorization': `Token ${token}`,  // If using JWT, use Bearer
          },
          body: formDataToSend, // Ensure formData is correctly formatted
      });
  
      const data = await response.json();
  
      if (response.ok) {
          setResponseMessage('Playground registered successfully!');
          setFormData({
              name: '',
              location: '',
              address: '',
              time_slot_start: '',
              time_slot_end: '',
              num_players: '',
              platform_type: 'football',
              image: null,
              price: '',
          });
      } else {
          console.error("Error:", data);
          setResponseMessage(`Error: ${data.detail || 'An error occurred'}`);
      }
  } catch (error) {
      console.error('Network error:', error);
      setResponseMessage('Network error occurred.');
  }
  
  };

  return (
    <div>
      <DashHead />
      <div className="dashboard-container">
        <Sidebar2 />
        <div className="dashboard-content">
          <div className="container mt-5">
              <div className="card p-4 shadow">
                <h1 className="text-center mb-4">Playground Registration</h1>
                {responseMessage && <p className="alert alert-info">{responseMessage}</p>}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Playground Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location:</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <textarea
                      id="address"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="time_slot_start" className="form-label">Time Slot Start:</label>
                      <input
                        type="time"
                        id="time_slot_start"
                        name="time_slot_start"
                        className="form-control"
                        value={formData.time_slot_start}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="time_slot_end" className="form-label">Time Slot End:</label>
                      <input
                        type="time"
                        id="time_slot_end"
                        name="time_slot_end"
                        className="form-control"
                        value={formData.time_slot_end}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="num_players" className="form-label">Number of Players:</label>
                    <input
                      type="number"
                      id="num_players"
                      name="num_players"
                      className="form-control"
                      value={formData.num_players}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="platform_type" className="form-label">Platform Type:</label>
                    <select
                      id="platform_type"
                      name="platform_type"
                      className="form-select"
                      value={formData.platform_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="football">Football Ground</option>
                      <option value="cricket">Cricket Ground</option>
                      <option value="park">Children’s Park</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image:</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price per Hour:</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="form-control"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Register Playground</button>
                </form>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default PlaygroundRegister;
