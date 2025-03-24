// src/components/Contact.js
import React from "react";
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"; // Importing Icons

const Contact = () => {
  return (
    <div>
      <Header />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card p-4 border-0 shadow-sm" style={{ background: "linear-gradient(to right, #ffffff, #f8f9fa)", borderRadius: "12px" }}>
              <h1 className="text-center mb-4 text-primary">📞 Contact Us</h1>
              <p className="lead text-center text-muted">We’d love to hear from you! Reach out to us for any inquiries.</p>

              <hr />

              {/* Contact Information */}
              <div className="mb-4">
                <h3 className="text-success">📍 Our Office</h3>
                <p className="text-dark">
                  <FaMapMarkerAlt className="me-2 text-danger" /> 123 Playground Street, Tech City, Country
                </p>
                <p className="text-dark">
                  <FaPhone className="me-2 text-primary" /> +1 234 567 890
                </p>
                <p className="text-dark">
                  <FaEnvelope className="me-2 text-warning" /> support@smartplayground.com
                </p>
              </div>

              {/* Contact Form */}
              <div className="mb-4">
                <h3 className="text-info">📧 Get in Touch</h3>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" placeholder="Enter your name" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="Enter your email" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="4" placeholder="Write your message..." required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mt-2 shadow">
                    Send Message 🚀
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
