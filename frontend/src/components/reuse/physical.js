import { useEffect, useState } from "react";
import '../../styles/physical.css';

const PhysicalData = () => {
  const [fitData, setFitData] = useState(
    JSON.parse(localStorage.getItem("lastFitData")) || null
  );
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken"); 

  useEffect(() => {
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/google-fit/", {
      headers: { Authorization: `Token ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        setFitData(data);
        localStorage.setItem("lastFitData", JSON.stringify(data)); // Store last fetched data
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching Google Fit data:", error);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="google-fit-container">
      <h1>Google Fit Data</h1>
      {loading && !fitData ? (
        <p className="loading-text">Loading Google Fit data...</p>
      ) : (
        <ul className="google-fit-list">
          {Object.entries(fitData?.data || {}).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PhysicalData;
