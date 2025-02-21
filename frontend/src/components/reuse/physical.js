import { useEffect, useState } from "react";

const PhysicalData = () => {
  const [fitData, setFitData] = useState(null);
  const token = localStorage.getItem("authToken"); // Get stored user token
  console.log("token from physical:",token)

  useEffect(() => {
    if (!token) return; // Avoid making API calls if token is missing

    fetch("http://127.0.0.1:8000/api/google-fit/", {
      headers: { Authorization: `Token ${token}` }  // Include token for authentication
    })
      .then(response => response.json())
      .then(data => setFitData(data))
      .catch(error => console.error("Error fetching Google Fit data:", error));
  }, [token]); 

  return (
    <div>
      <h1>Google Fit Data</h1>
      {fitData ? (
        <ul>
          {Object.entries(fitData.data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading Google Fit data...</p>
      )}
    </div>
  );
};

export default PhysicalData;
