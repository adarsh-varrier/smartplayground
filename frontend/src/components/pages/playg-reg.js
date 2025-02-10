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
          <div>
            <h1>Playground Registration</h1>
            {responseMessage && <p>{responseMessage}</p>}
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label htmlFor="name">Playground Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="time_slot_start">Time Slot Start:</label>
              <input
                type="time"
                id="time_slot_start"
                name="time_slot_start"
                value={formData.time_slot_start}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="time_slot_end">Time Slot End:</label>
              <input
                type="time"
                id="time_slot_end"
                name="time_slot_end"
                value={formData.time_slot_end}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="num_players">Number of Players:</label>
              <input
                type="number"
                id="num_players"
                name="num_players"
                value={formData.num_players}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="platform_type">Platform Type:</label>
              <select
                id="platform_type"
                name="platform_type"
                value={formData.platform_type}
                onChange={handleChange}
                required
              >
                <option value="football">Football Ground</option>
                <option value="cricket">Cricket Ground</option>
                <option value="park">Children’s Park</option>
              </select>
            </div>
            <div>
              <label htmlFor="image">Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <label htmlFor="price">Price per Hour:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Register Playground</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlaygroundRegister;
