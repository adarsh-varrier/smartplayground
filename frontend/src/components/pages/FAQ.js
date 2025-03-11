import React, { useState, useEffect } from "react";
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 

import DashHead from '../reuse/header2';
import Sidebar2 from '../reuse/owner-side';
import StarRating from "../reuse/rating";

function FAQ() {

      const [query, setQuery] = useState("");
      const [faq, setFaq] = useState(null);
      const [error, setError] = useState("");

    const [userdetails, setUserDetails] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error("No token found, user is not logged in.");
          return;
        }
    
        fetch('http://127.0.0.1:8000/api/settings/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
        })
          .then(response => response.json())
          .then(data => {
            setUserDetails(data);
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
        });
    }, []);


    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/faq/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (response.ok) {
                setFaq(data);
                setError("");
            } else {
                setFaq(null);
                setError(data.message);
            }
        } catch (error) {
            console.error("Error fetching FAQ:", error);
            setError("Failed to fetch FAQ");
        }
    };

   return (
    <div>
        <div className='head-customer'>
          <DashHead/>
        </div>
        <div className='dashboard-container'>
            {userdetails && userdetails.user_type === 'Customer' ? <Sidebar /> : <Sidebar2 />}
            <div className='dashboard-content'>
              <div className="container mt-4">
                <h2 className="text-primary text-center mb-4">Frequently Asked Questions</h2>

                  {/* Search Bar */}
                  <div className="row justify-content-center">
                      <div className="col-md-8">
                          <div className="input-group">
                              <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Ask a question..."
                                  value={query}
                                  onChange={(e) => setQuery(e.target.value)}
                              />
                              <button className="btn btn-primary" onClick={handleSearch}>
                                  Search
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* FAQ Results */}
                  <div className="row justify-content-center mt-4">
                      <div className="col-md-8">
                          {faq ? (
                              <div className="alert alert-success shadow-sm p-3">
                                  <h5 className="fw-bold">{faq.question}</h5>
                                  <p>{faq.answer}</p>
                              </div>
                          ) : (
                              error && <div className="alert alert-warning text-center">{error}</div>
                          )}
                      </div>
                  </div>
              </div>
              <div><StarRating/></div>
            </div>
        </div>
    </div>
  );
}

export default FAQ;