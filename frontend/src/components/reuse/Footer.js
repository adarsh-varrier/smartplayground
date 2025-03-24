import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"; // Import icons

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto" style={{ minHeight: "100px" }}>
      <p>&copy; 2025 My Website. All rights reserved.</p>
      
      {/* Social Media Icons */}
      <div className="d-flex justify-content-center gap-3 mt-2">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
          <FaInstagram />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
          <FaTwitter />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
