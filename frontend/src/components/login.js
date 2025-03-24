// src/components/Login.js
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import myImage from '../assets/basketball1.jpg'; 
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Prevent submission if validation fails
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/", 
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("authToken", response.data.token); // Store token
      localStorage.setItem("userId", response.data.userId);    // Storing the user ID
  
      if (response.data.user_type === "Customer") {
        navigate("/customer-dashboard");
      } else if (response.data.user_type === "Owner") {
        navigate("/owner-dashboard");
      } else if(response.data.user_type === "Admin"){
        navigate("/admin-dashboard");
      } else {
        setMessage("Invalid user type.");
      }
    } catch (error) {
      console.error("Error response:", error);  // Log the full error
      setMessage("Login failed: " + (error.response?.data.message || "Something went wrong"));
    }
  };
  
  return (
    <div>
      <Header />
      <div className="row justify-content-center">
        <div className="login-container">
          <div className="background">
            <img src={myImage} alt="Login Background" className="bg-image" />
          </div>
          <div className="login-form">
            <h2 className="text-center mb-4">Login</h2>
            <Link className="nav-link" to="/register">Create new account</Link>
            <div className="card p-4 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    onChange={handleChange}
                    
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    onChange={handleChange}
      
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Login
                </button>
                <div className="text-center mt-2">
                  <Link to="/forgot">Forgot password?</Link>
                </div>
              </form>
              {message && <p className="mt-3 text-danger">{message}</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
