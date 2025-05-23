import React, { useState, useEffect } from "react";
import Sidebar from "../reuse/user-side";
import Sidebar2 from "../reuse/owner-side";
import Sidebar3 from "../reuse/admin-side";
import DashHead from "../reuse/header2";

const Settings = () => {
  const [userdetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    location: '',
    password: '',
    confirmPassword: '', // Confirm password field
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setEditForm({
          username: data.username,
          email: data.email,
          location: data.location || '',
          password: '',
          confirmPassword: '', // Reset confirm password
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (editForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(editForm.password)) {
      setError("Password must contain at least 1 uppercase, 1 number, and 1 special character.");
      return;
    }
    if (editForm.password !== editForm.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError(""); // Clear error if passwords match

    const token = localStorage.getItem('authToken');
    if (!token) return;

    fetch('http://127.0.0.1:8000/api/settings/', {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: editForm.username,
        email: editForm.email,
        location: editForm.location,
        password: editForm.password, // Send new password
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error); // Show error if passwords don't match
          setSuccessMessage(''); // Clear success message
        } else {
          setUserDetails(data);
          setSuccessMessage('Your details were updated successfully!');
          setEditForm({
            username: data.username,
            email: data.email,
            location: data.location || '',
            password: '',
            confirmPassword: '', // Reset confirm password after update
          });
          setError(''); // Clear any errors
        }
      })
      .catch(error => {
        console.error('Error updating user data:', error);
        setError('An error occurred while updating your details.');
        setSuccessMessage(''); // Clear success message
      });
  };

  return (
    <div>
      <div className='head-customer'>
          <DashHead/>
      </div>
      <div className='dashboard-container'>
      {userdetails ? (
              userdetails.user_type === 'Customer' ? (
                  <Sidebar />
              ) : userdetails.user_type === 'Owner' ? (
                  <Sidebar2 />
              ) : (
                  <Sidebar3 />
              )
          ) : null}
        <div className='dashboard-content'>
          <h1>Settings</h1>
          <h3>Your Details</h3>
          {loading ? (
            <p>Loading user details...</p>
          ) : userdetails ? (
            <div>
              <p><strong>Username:</strong> {userdetails.username}</p>
              <p><strong>Email:</strong> {userdetails.email}</p>
              <p><strong>Location:</strong> {userdetails.location || "Not provided"}</p>
              <p><strong>User Type:</strong> {userdetails.user_type}</p>
            </div>
          ) : (
            <p>Failed to load user details.</p>
          )}

          <h3>Edit Your Details</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={editForm.password}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={editForm.confirmPassword}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Details</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
