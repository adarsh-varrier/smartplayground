// src/components/About.js
import React from "react";
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";

const About = () => {
  return (
    <div>
      <Header />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card p-4 border-0 shadow-sm" style={{ background: "linear-gradient(to right, #ffffff, #f8f9fa)", borderRadius: "12px" }}>
              <h1 className="text-center mb-4 text-primary">About Smart Playground</h1>
              <p className="lead text-center text-muted">
                A next-generation smart system to enhance the playground experience.
              </p>

              <hr />

              {/* Project Goal & Aim */}
              <div className="mb-4">
                <h3 className="text-success">🎯 Project Goal & Aim</h3>
                <p className="text-dark">
                  Smart Playground is designed to create a **safe, interactive, and technology-driven**
                  experience for users. It integrates **real-time weather analysis, health tracking, AI-based
                  skin condition prediction, and game recommendations** to improve outdoor activities.
                </p>
              </div>

              {/* How It Works */}
              <div className="mb-4">
                <h3 className="text-info">⚙️ How It Works</h3>
                <ul className="list-group">
                  <li className="list-group-item bg-light">
                    <strong>🌦️ Weather-Based Suggestions:</strong> Uses Weather Map API to provide health
                    and safety advice before entering a playground.
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>🩺 Health Monitoring:</strong> Google Fit API integration for fitness tracking,
                    diet recommendations, and activity analysis.
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>🛡️ Skin Condition Prediction:</strong> Machine Learning model to predict skin
                    issues based on UV index, temperature, and exposure time.
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>📍 Playground Finder:</strong> Users can **search playgrounds based on location**
                    and book their slots online.
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>🤖 Chatbot Assistance:</strong> AI chatbot to assist users with game tips and
                    playground queries.
                  </li>
                </ul>
              </div>

              {/* Key Features */}
              <div className="mb-4">
                <h3 className="text-warning">🚀 Key Features</h3>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled text-dark">
                      <li>✅ User-friendly interface</li>
                      <li>✅ Real-time notifications</li>
                      <li>✅ Interactive FAQ system</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled text-dark">
                      <li>✅ Secure authentication</li>
                      <li>✅ Gamified experiences</li>
                      <li>✅ Mobile-responsive design</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-4">
                <h4 className="text-danger">Join Us in Making Playgrounds Smarter! 🌍</h4>
                <p className="text-muted">Experience a **tech-enhanced** way of enjoying outdoor activities.</p>
                <a href="/register" className="btn btn-primary btn-lg mt-3 shadow">
                  Get Started Now 🚀
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
