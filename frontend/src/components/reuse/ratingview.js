import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const RatingGraph = () => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

        if (!token) {
            alert("You need to be logged in to submit a rating.");
            return;
        }
    axios.get("http://127.0.0.1:8000/api/average-rating/", 
        {
            headers: { Authorization: `Token ${token}` }  // Proper placement of headers
        }).then((response) => {
      setAverageRating(response.data.average_rating);
    });
  }, []);

  const data = [{ name: "Average Rating", rating: averageRating }];

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center vh-100">
  <div className="card p-5 shadow-lg rounded w-75" style={{ backgroundColor: "#f8f9fa" }}>
    <h3 className="text-center text-dark mb-4">📊 App Rating Overview</h3>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#333" tick={{ fontSize: 16 }} />
        <YAxis domain={[0, 5]} stroke="#333" tick={{ fontSize: 16 }} />
        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd" }} />
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <Bar dataKey="rating" fill="url(#colorGradient)" barSize={60} radius={[8, 8, 0, 0]} />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffcc00" />
            <stop offset="100%" stopColor="#ff6600" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  );
};

export default RatingGraph;
