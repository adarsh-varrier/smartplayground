// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home'; // Correct if the file is named Home.js (capital H)
// src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Contact from './components/contact';
import Login from './components/login';
import About from './components/About';
import Register from './components/register';
import CustomerDashboard from './components/userdash';
import OwnerDashboard from './components/ownerdash';
import AdminDashboard from './components/admindash';
import PrivateRoute from './components/reuse/PrivateRoute';
import Settings from './components/pages/settings';



function App() {
  return (
    <Router>
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Home />} />   {/* Home page route */}
        <Route path="/login" element={<Login />} />   {/* Login page route */}
        <Route path="/about" element={<About />} />   {/* Login page route */}
        <Route path="/contact" element={<Contact />} />   {/* Login page route */}
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
