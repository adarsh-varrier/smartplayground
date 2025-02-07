// src/components/Login.js
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
  
      if (response.data.user_type === "Customer") {
        navigate("/customer-dashboard");
      } else if (response.data.user_type === "Owner") {
        navigate("/owner-dashboard");
      } else if(response.data.user_type === "Admin"){
        navigate("/admin-dashboard");
      }
      else{
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
        <h2 className="text-center mb-4">Login</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Login
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

export default Login;
