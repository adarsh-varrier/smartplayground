// src/components/About.js
import React from 'react';
import Header from "./reuse/Header";
import Footer from "./reuse/Footer";

const About = () => {
  return (
    <div>
      <Header />
      <h1>About Page</h1>
      <p>Please enter your credentials to log in.</p>
      {/* Your login form can go here */}
      <Footer />
    </div>
  );
};

export default About;