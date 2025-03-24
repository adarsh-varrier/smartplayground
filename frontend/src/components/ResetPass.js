import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./reuse/Header";

const ResetPassword = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match before making API call
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/reset-password/${uidb64}/${token}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();
            setMessage(data.message);

            if (response.ok) {
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            setMessage("Error resetting password.");
        }
    };

    return (
        <div>
            <Header />
            <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-3">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Reset Password
                    </button>
                </form>
                {message && <p className="text-center mt-3 text-danger">{message}</p>}
            </div>
        </div>
        </div>
    );
};

export default ResetPassword;
