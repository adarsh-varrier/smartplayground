// src/components/Register.js
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import myImage from '../assets/main2.jpg';
import '../styles/register.css';

const Register = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    user_type: "",
    location: "",
    password: "",
    password2: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleLocationChange = async (e) => {
    const query = e.target.value;
    setFormData({ ...formData, location: query });

    if (query.length > 2) {
      try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: query,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/.test(formData.email))   {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    // User Type validation
    if (!formData.user_type) {
      newErrors.user_type = "This field is required.";
      isValid = false;
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "Password must contain at least 1 uppercase, 1 number, and 1 special character.";
      isValid = false;
    }

    // Confirm Password validation
    if (formData.password2 !== formData.password) {
      newErrors.password2 = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", formData);
      setMessage(response.data.message);

      if (response.data.success) {
        setFormData({
          username: "",
          email: "",
          user_type: "",
          location: "",
          password: "",
          password2: "",
        });

        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data || "Something went wrong"));
    }
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <div className="background">
          <img src={myImage} alt="Register Background" className="bg-image" />
        </div>

        <div className="register-form container my-5 py-4">
          <h2 className="text-center mb-4">Register</h2>
          <Link className="nav-link" to="/login">
            Already have an account? <b>Login</b>
          </Link>
          <div className="card p-4 shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <small className="text-danger">{errors.username}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">User Type</label>
                <Select
                  options={userTypeOptions}
                  onChange={handleUserTypeChange}
                  value={userTypeOptions.find((option) => option.value === formData.user_type)}
                  placeholder="Select user type"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#fff", // White background
                      color: "#000", // Black text color
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "#000", // Black text color for the selected value
                    }),
                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: "#fff", // White dropdown background
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      color: state.isSelected ? "#fff" : "#000", // White text when selected, black otherwise
                      backgroundColor: state.isSelected ? "#007bff" : "#fff", // Blue background when selected
                    }),
                  }}
                />
                {errors.user_type && <small className="text-danger">{errors.user_type}</small>}
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleLocationChange}
                  placeholder="Start typing a location..."
                  
                />
                {errors.location && <small className="text-danger">{errors.location}</small>}
                {suggestions.length > 0 && (
                  <ul className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                    {suggestions.map((place) => (
                      <li
                        key={place.place_id}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          setFormData({ ...formData, location: place.display_name });
                          setSuggestions([]);
                        }}
                      >
                        {place.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="password2"
                  className="form-control"
                  value={formData.password2}
                  onChange={handleChange}
                  
                />
                {errors.password2 && <small className="text-danger">{errors.password2}</small>}
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                Register
              </button>
            </form>
            {message && <p className="mt-3 text-danger">{message}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
