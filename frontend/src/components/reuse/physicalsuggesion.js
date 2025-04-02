import { useEffect, useState } from "react";
import '../../styles/physicalsuggesion.css'; 
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

const PhysicalSuggesion = () => {
  const [fitData, setFitData] = useState(null);
  const [lastFiveDays, setLastFiveDays] = useState([]);
  const [finalStatus, setFinalStatus] = useState(null);
  const token = localStorage.getItem("authToken"); // Get stored user token

  useEffect(() => {
    if (!token) return; // Avoid making API calls if token is missing

    // Fetch latest stored Google Fit data
    fetch("http://127.0.0.1:8000/api/google-fit/fetch-store/", {
        headers: { Authorization: `Token ${token}` },
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === "success") {
            setFitData(data.data); // ✅ Set the actual fetched data
          }
        })
        .catch(error => console.error("Error fetching Google Fit data:", error));

    // Fetch last 5 days of data
    fetch("http://127.0.0.1:8000/api/google-fit/last-five-days/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "success") {
          setLastFiveDays(data.data); // Store last 5 days data
          setFinalStatus(data.final_health_status);
        }
      })
      .catch(error => console.error("Error fetching last 5 days of data:", error));

  }, [token]); 

  const getHealthIcon = (status) => {
    switch (status.toLowerCase()) {
        case "healthy":
            return <FaSmile className="icon healthy" />;
        case "unhealthy":
            return <FaFrown className="icon unhealthy" />;
        case "average":
            return <FaMeh className="icon average" />;
        default:
            return null;
    }
  };

  const getHealthAdvice = (status) => {
    if (status.toLowerCase() === "unhealthy") {
        return (
            <div className="health-advice">
                <h4>🚨 Doctor's Recommendations:</h4>
                <ul>
                    <li>🏃 Increase your daily steps (Target: 8,000+ steps/day)</li>
                    <li>🥦 Follow a balanced diet rich in vegetables and proteins</li>
                    <li>💧 Stay hydrated (Drink at least 2-3L of water/day)</li>
                    <li>🛌 Get enough sleep (7-9 hours per night)</li>
                    <li>🧘 Practice stress management (Yoga, meditation, or breathing exercises)</li>
                    <li>🔍 Monitor your heart rate and consult a doctor if needed</li>
                </ul>
            </div>
        );
    }
    return null; // No advice for Healthy or Moderate statuses
};


  return (
    <div className="container">
        <div className="row">    
            {fitData && <p>Steps: {fitData.steps}</p>}
        </div>
      {/* Last 5 Days Data */}
        <div className="row">
            <h2>Recent 5 Activities in SmartPlay </h2>
        </div>
        <div className="row"> 
            {lastFiveDays.length > 0 ? (
                <table className="data-table">
            <thead>
                <tr>
                <th>Date</th>
                <th>Steps</th>
                <th>Calories Burned(kcal)</th>
                <th>Heart Rate(bpm)</th>
                <th>active_session(min)</th>
                <th>Distance_moved(km)</th>               
                </tr>
            </thead>
            <tbody>
            {lastFiveDays.map((day, index) => (
                <tr key={index}>
                <td>{day.date || "N/A"}</td>
                <td>{day.steps || 0}</td>
                <td>{day.calories_burned || 0}</td>
                <td>{day.heart_rate || "N/A"}</td>
                <td>{day.activity_sessions ?? "N/A"}</td>
                <td>{day.distance_moved ?? "N/A"}</td>       
                </tr>
            ))}
            </tbody>
            </table>
        ) : (
            <p>No data available for the last 5 days.</p>
        )}
        </div>
        <div className="physical-status">
            <div className="health-satus-head">
              <h3>Overall Health Status:</h3>
            </div>
            <div className="health-satus">
            {finalStatus ? (
                <p className={`status-text ${finalStatus.toLowerCase()}`}>
                  {getHealthIcon(finalStatus)}
                  {finalStatus}
                </p>
            ) : (
                <p>Loading health status...</p>
            )}
            </div>
            {/* Show Health Advice if Status is Unhealthy */}
          {finalStatus && getHealthAdvice(finalStatus)}
        </div>
    </div>
  );
};

export default PhysicalSuggesion;
