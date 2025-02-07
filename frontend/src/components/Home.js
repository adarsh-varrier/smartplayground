// src/Home.js
import React, { useEffect, useState } from 'react';
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import myImage from '../assets/home1.jpg';  // Adjust the path as needed


const Home = () => {
    const [message, setMessage] = useState('');

    // Fetch data from Django backend (Test connection)
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/test/', { // API endpoint for testing
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setMessage(data.message); // Set message from backend
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setMessage('Failed to connect to the backend.');
        });
    }, []);

    return (
        <div>
            <Header />
            <div className="position-relative text-center">
                {/* Image */}
                <img src={myImage} className="w-100 h-100" alt="main-image" />

                {/* Overlayed Content */}
                <div className="position-absolute top-50 start-50 translate-middle text-white">
                    <h1 className="mt-5">Welcome to the Home Page</h1>
                    <p className="mt-3">{message}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
