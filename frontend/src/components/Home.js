// src/Home.js
import React, { useRef, } from 'react';
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import myImage1 from '../assets/woman.jpg';  
import myImage2 from '../assets/shoe.jpg';
import myVideo from '../assets/main.mp4';
import Chatbot from './chatbot';

import '../styles/home.css';

const Home = () => {
    const videoRef = useRef(null);
    

    return (
        <div>
            <Header/>
            <div className="Smartplay-main">
                <div className="video-container">
                    {/* Video Background */}
                    <div className="video-background">
                        <video 
                            ref={videoRef}
                            src={myVideo} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                        />
                    </div>

                    {/* Overlayed Text */}
                    <div className="video-overlay">
                        <h2 className='text-white'><b>YOUR  NEAREST SPORTS COMMUNITY</b></h2>
                    </div>
                </div>

                {/* Image */}
                <img src={myImage1} className="w-100 h-100" alt="main-image" />
                <div style={{ backgroundColor: '#231056', width: '99vw', height: '100vh' }} className="section">
                    <p className="text-white text-2xl font-bold"></p>
                </div>
                <img src={myImage2} className="w-100 h-100" alt="main-image" />

                <Chatbot/>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
