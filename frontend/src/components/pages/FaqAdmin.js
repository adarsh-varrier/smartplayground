import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import "../../styles/user-dash.css";
import "../../styles/head-common.css";

import DashHead from "../reuse/header2";
import Sidebar3 from "../reuse/admin-side";

function FAQAdmin() {
    const [faqs, setFaqs] = useState([]);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No token found, user is not logged in.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/faqs/", {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFaqs(data);
            } else {
                console.error("Failed to fetch FAQs");
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No token found, user is not logged in.");
            return;
        }

        const method = editId ? "PUT" : "POST";
        const url = editId
            ? `http://127.0.0.1:8000/api/faqs/${editId}/`
            : "http://127.0.0.1:8000/api/faqs/";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question, answer }),
            });

            if (response.ok) {
                fetchFAQs();
                setQuestion("");
                setAnswer("");
                setEditId(null);
            } else {
                console.error("Failed to submit FAQ");
            }
        } catch (error) {
            console.error("Error submitting FAQ:", error);
        }
    };

    const handleEdit = (faq) => {
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setEditId(faq.id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No token found, user is not logged in.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/faqs/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                fetchFAQs();
            } else {
                console.error("Failed to delete FAQ");
            }
        } catch (error) {
            console.error("Error deleting FAQ:", error);
        }
    };

    return (
        <div>
            <div className="head-customer">
                <DashHead />
            </div>
            <div className="dashboard-container d-flex">
                <Sidebar3 />
                <div className="dashboard-content container mt-4">
                    <h2 className="mb-4 text-primary">FAQ - Admin</h2>

                    {/* FAQ Form */}
                    <form className="card p-4 shadow-sm mb-4" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Question</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Answer</label>
                            <textarea
                                className="form-control"
                                placeholder="Enter answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-25">
                            {editId ? "Update FAQ" : "Add FAQ"}
                        </button>
                    </form>

                    {/* FAQ List */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">FAQ List</h5>
                        </div>
                        <ul className="list-group list-group-flush">
                            {faqs.map((faq) => (
                                <li key={faq.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{faq.question}</strong> <br />
                                        <span className="text-muted">{faq.answer}</span>
                                    </div>
                                    <div>
                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(faq)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(faq.id)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FAQAdmin;
