import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/uv.css';

function UvRate({ playgroundId, token }) {
  const [uvData, setUvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const fetchUVData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/playground/${playgroundId}/uv-data/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        console.log("API Response:", response.data); // Debugging log
        setUvData(response.data);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to fetch UV data");
      } finally {
        setLoading(false);
      }
    };

    if (playgroundId && token) {
      fetchUVData();
    } else {
      console.warn("playgroundId or token is missing!");
      setLoading(false);
    }
  }, [playgroundId, token]);

  if (loading) return <p>Loading UV data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!uvData) return <p>No UV data available</p>;

  
    // Safe extraction of sun_info data
    const sunInfo = uvData.sun_info || {};
    const sunTimes = sunInfo.sun_times || {};
    const safeExposure = uvData.safe_exposure_time || {};

  return (
    <div>
        <div className="uv-container">
            <div className='col'>
                <h2>🌞 UV & Sun Safety</h2>
                <p><strong>🌡️ Current UV Index:</strong> {uvData.uv_index ?? "N/A"}</p>
                <p><strong>⚠️ Max UV Today:</strong> {uvData.uv_max ?? "N/A"}</p>
                <p><strong>🕒 Peak UV Time:</strong> {uvData.uv_max_time ? new Date(uvData.uv_max_time).toLocaleTimeString() : "N/A"}</p>
                <p><strong>🌍 Ozone Level:</strong> {uvData.ozone ?? "N/A"} DU</p>
                <p><strong>🌅 Sunrise:</strong> {sunTimes.sunrise ? new Date(sunTimes.sunrise).toLocaleTimeString() : "N/A"}</p>
                <p><strong>🌇 Sunset:</strong> {sunTimes.sunset ? new Date(sunTimes.sunset).toLocaleTimeString() : "N/A"}</p>
                <p><strong>☀️ Golden Hour:</strong> {sunTimes.goldenHour ? new Date(sunTimes.goldenHour).toLocaleTimeString() : "N/A"}</p>
                
                </div>
            <div className='col'>
                <h3>⏳ Safe Sun Exposure Time:</h3>
                <ul>
                    <li>Skin Type 1: {safeExposure.st1 ?? "N/A"} min</li>
                    <li>Skin Type 2: {safeExposure.st2 ?? "N/A"} min</li>
                    <li>Skin Type 3: {safeExposure.st3 ?? "N/A"} min</li>
                    <li>Skin Type 4: {safeExposure.st4 ?? "N/A"} min</li>
                    <li>Skin Type 5: {safeExposure.st5 ?? "N/A"} min</li>
                    <li>Skin Type 6: {safeExposure.st6 ?? "N/A"} min</li>
                </ul>
            </div>
            <p><strong>🔆 Sun Protection Advice:</strong> {uvData.sun_protection_advice ?? "N/A"}</p>
        </div>
    </div>
  );
}

export default UvRate;

