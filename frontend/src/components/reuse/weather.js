import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WeatherData() {
  const [weather, setWeather] = useState(null);
  const [futureWeather, setFutureWeather] = useState([]); // Next 48-hour weather
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("No token found, user is not logged in.");
      return;
    }

    // Function to fetch weather data
    const fetchWeather = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/weather/', {
          headers: { 'Authorization': `Token ${token}` },
        });
        console.log("API Response:", response.data); // Log the entire response
    
        // Check if future_weather exists and is an array
        const futureWeatherData = Array.isArray(response.data.future_weather)
          ? response.data.future_weather
          : [];
    
        setWeather(response.data.current_weather);  // Set current weather
        setFutureWeather(response.data.next_48_hour_forecast.slice(0, 16));  // Update this line

        console.log(futureWeatherData)
    
      } catch (err) {
        setError('Error fetching weather data.');
        console.error('Error:', err.response || err.message || err);
      }

    };

    // Set current date & time
    const getCurrentDateTime = () => {
      const date = new Date();
      const formattedDate = date.toLocaleString();
      setCurrentDateTime(formattedDate);
    };

    fetchWeather();
    getCurrentDateTime();

    const intervalId = setInterval(getCurrentDateTime, 60000); // Update every 60 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container my-4">
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display current date and time */}
      <div className="mb-3">
        <h4 className="text-center">Current Date and Time: {currentDateTime}</h4>
      </div>

      {/* Current weather */}
      {weather ? (
        <div className="card shadow-lg mb-4">
          <div className="card-body">
            <h2 className="card-title text-center">
              {weather.name}, {weather.sys?.country}
            </h2>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
                <p><strong>Feels Like:</strong> {weather.main.feels_like}°C</p>
                <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
                <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
              </div>
              <div className="col-md-6">
                <p><strong>Wind Direction:</strong> {weather.wind.deg}°</p>
                <p><strong>Cloud Coverage:</strong> {weather.clouds.all}%</p>
                <p><strong>Visibility:</strong> {weather.visibility / 1000} km</p>
                <p><strong>Weather:</strong> {weather.weather[0]?.description}</p>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0]?.icon}.png`} alt="weather-icon" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading current weather data...</p>
      )}

{futureWeather.length > 0 && (
  <div className="card shadow-lg mb-4">
    <div className="card-body">
      <h2 className="card-title text-center">Next 48 Hours Forecast</h2>
      <div className="row">
        {futureWeather.map((hourly, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <div className="card text-center">
              <div className="card-body">
                <h6>{new Date(hourly.dt * 1000).toLocaleString()}</h6>
                <p><strong>Temp:</strong> {hourly.main.temp}°C</p>
                <p><strong>Weather:</strong> {hourly.weather[0]?.description}</p>
                <img src={`http://openweathermap.org/img/wn/${hourly.weather[0]?.icon}.png`} alt="weather-icon" className="img-fluid" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{futureWeather.length === 0 && <p className="text-center">Loading future weather data...</p>}


    </div>
  );
}

export default WeatherData;
