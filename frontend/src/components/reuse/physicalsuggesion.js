import { useEffect, useState } from "react";
import '../../styles/physicalsuggesion.css'; 

const PhysicalSuggesion = () => {
  const [fitData, setFitData] = useState(null);
  const [lastFiveDays, setLastFiveDays] = useState([]);
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
        }
      })
      .catch(error => console.error("Error fetching last 5 days of data:", error));

  }, [token]); 

  return (
    <div className="container">
        <div className="row">    
            {fitData && <p>Steps: {fitData.steps}</p>}
        </div>
      {/* Last 5 Days Data */}
        <div className="row">
            <h2>Last 5 Days Data</h2>
        </div>
        <div className="row"> 
            {lastFiveDays.length > 0 ? (
                <table className="data-table">
            <thead>
                <tr>
                <th>Date</th>
                <th>Steps</th>
                <th>Calories Burned</th>
                <th>Heart Rate</th>
                <th>active_session</th>
                <th>Distance_moved</th>
                <th>Moved Minutes</th>
                <th>Height</th>
                <th>Weight</th>
                
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
                <td>{day.move_minutes ?? "N/A"}</td>    
                <td>{day.weight ?? "N/A"}</td>          
                <td>{day.height ?? "N/A"}</td>         
                </tr>
            ))}
            </tbody>
            </table>
        ) : (
            <p>No data available for the last 5 days.</p>
        )}
        </div> 
    </div>
  );
};

export default PhysicalSuggesion;
