import React, { useState } from "react";
import { FaRobot } from "react-icons/fa"; // Import robot icon
import '../styles/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Floating Chatbot Button */}
      <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <FaRobot size={30} />
      </div>

      {/* Chatbot Window (Expands on Click) */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>PlayMate AI</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <iframe
            src="http://localhost:8501"
            title="SmartCoach"
            width="100%"
            height="400px"
            style={{ border: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
