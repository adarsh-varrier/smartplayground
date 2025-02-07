// src/components/Register.js
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    user_type: "",
    location: "",  // You can integrate with Google Maps API here
    password: "",
    password2: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const userTypeOptions = [
    { value: "Owner", label: "Owner" },
    { value: "Customer", label: "Customer" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (option) => {
    setFormData({ ...formData, user_type: option.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", formData);
      setMessage(response.data.message);

      // If registration is successful, navigate to the login page
      if (response.data.success) {
        setFormData({
          username: "",
          email: "",
          user_type: "",
          location: "",
          password: "",
          password2: "",
        }); // Clear the form data

        // Optionally reset the message
        setMessage("Registration successful! Redirecting to login...");

        // Wait a bit to show the success message before redirecting
        setTimeout(() => {
          navigate("/login"); // Navigate to login page
        }, 1000); // You can adjust the timeout duration if needed
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data || "Something went wrong"));
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">User Type</label>
            <Select
              options={userTypeOptions}
              onChange={handleUserTypeChange}
              value={userTypeOptions.find(option => option.value === formData.user_type)} // Sync with form data
              placeholder="Select user type"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="password2" className="form-control" value={formData.password2} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        {message && <p className="mt-3">{message}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default Register;
