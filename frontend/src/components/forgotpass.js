import React, { useState } from "react";
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import myImage from "../assets/billiards.jpg";
import '../styles/forgot.css';

function Forgot() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/request-reset-password/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            console.log("Sending email:", email);
            const data = await response.json();
            console.log("Response:", data);
            setMessage(data.message);
        } catch (error) {
            setMessage("Something went wrong. Try again.");
        }
    };

    return (
        <div>
            <Header />
            <div className="forgot-container">
                <img src={myImage} className="background-image" alt="main-image" />
                <div className="forgot-form">
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Send Reset Link</button>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Forgot;
