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
import Ownerplay from './components/pages/playg-owner';
import PlayReg from './components/pages/playg-reg';
import PlaygroundDetail from './components/pages/playg-owner-details';
import CustomerPlayg from './components/pages/playg-customer';
import PlaygroundDetail2 from './components/pages/playg-custo-view';
import Ticket from './components/pages/ticket';
import Confirmation from './components/pages/confirmation';
import PhysicalView from './components/pages/Physical-view';

import Games from './components/pages/Games';
import FAQ from './components/pages/FAQ';
import Notifications from './components/pages/notifications';
import HereMap from './components/pages/map';
import UserManagement from './components/pages/user-manage';
import PlaygManagement from './components/pages/playgManagement';
import BookingView from './components/pages/Booking';



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
          <Route path="/ownerplay" element={<Ownerplay />} />
          <Route path="/play-registration" element={<PlayReg />} />
          <Route path="/playground/:id" element={<PlaygroundDetail />} />
          <Route path="/playglist" element={<CustomerPlayg />} />
          <Route path="/playground-customer/:id" element={<PlaygroundDetail2 />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/childplay" element={<PhysicalView />} />
          <Route path="/childplay-owner" element={<BookingView />} />
          <Route path="/Games" element={<Games />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/location" element={<HereMap />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/PlaygManagement" element={<PlaygManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
