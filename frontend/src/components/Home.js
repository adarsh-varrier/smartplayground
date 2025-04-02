// src/Home.js
import React, { useRef, } from 'react';
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";
import myImage1 from '../assets/woman.jpg';  
import myImage2 from '../assets/shoe.jpg';
import myVideo from '../assets/main.mp4';
import Chatbot from './chatbot';

import '../styles/home.css';
import { FaSearch, FaCalendarCheck, FaFutbol, FaRunning } from "react-icons/fa";
import { WiRain } from "react-icons/wi";
import { MdFlightTakeoff } from "react-icons/md";
import { Link } from 'react-router-dom';

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
                        <h2 className='first-head text-white'><b className='first-view'>YOUR </b><b className='first-view'>NEAREST </b><b className='first-view'>SPORTS COMMUNITY</b></h2>
                    </div>
                </div>

                {/* Image */}
                <div className='adv'>
                    <div className='adv-img'>
                        <img src={myImage1} className="img-adv" alt="main-image" />
                    </div>
                    <div className='adv-list'>
                        <ul className='advertisement'>
                            <li className='adv-iem'><FaRunning size={24} className="tracker-icon" />Physical Tracker</li>
                            <li className='adv-iem'><WiRain size={32} className="weather-icon" />Weather Assistance</li>
                            <li className='adv-iem'><MdFlightTakeoff size={32} className="flight-icon" />Presence in 160+ Cities</li>
                        </ul>
                    </div>
                </div>
                <div style={{ backgroundColor: '#231056', width: '99vw', height: '100vh' }} className="section">
                    <div className='home-instruction'>
                        <div className='instruction'>
                            <div className='ins-col'>
                            <p><FaSearch size={40} className="home-ins-icon" /></p>
                            <p className="home-ins-text">Are you looking to play after work, organize your Sunday Five's football match? Explore the largest network of sports facilities whole over the India</p>
                            </div>
                        </div>
                        <div className='instruction'>
                            <div className='ins-col'>
                            <p><FaCalendarCheck size={40} className="home-ins-icon" /></p>
                            <p className="home-ins-text">Once you’ve found the perfect ground, court or gym, Connect with the venue through the Book Now Button to make online booking & secure easier payment</p>
                            </div>
                        </div>
                        <div className='instruction'>
                            <div className='ins-col'>
                            <p><FaFutbol size={40} className="home-ins-icon" /></p>
                            <p className="home-ins-text">You’re the hero, you’ve found a stunning turf or court, booked with ease and now its time to play. The scene is set for your epic match.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='home-bottom'>
                    <img src={myImage2} className="w-100 h-100" alt="main-image" />
                    <h3 className='bottom-head'>Let the World Play</h3>
                    <button className='second-login-btn'>
                        <span className="runner">
                            <Link className="nav-link" to="/login"><FaRunning />Book Your Sport</Link>
                        </span>
                    </button>
                </div>
                <Chatbot/>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
