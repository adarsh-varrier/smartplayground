import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/weather.css';
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
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display current date and time */}
      <div className="current-date">
        <h4 className="text-date">Current Date and Time: {currentDateTime}</h4>
      </div>

      {/* Current weather */}
      {weather ? (
        <div className="card-weather">
          <div className="card-body-weather">
            <h2 className="card-title-weather">
              {weather.name}, {weather.sys?.country}
            </h2>
            <div className="row">
              <div className="col">
                <p className='current-weather'><strong>Temperature:</strong> {weather.main.temp}°C</p>
                <p className='current-weather'><strong>Feels Like:</strong> {weather.main.feels_like}°C</p>
                <p className='current-weather'><strong>Humidity:</strong> {weather.main.humidity}%</p>
                <p className='current-weather'><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
                <p className='current-weather'><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
              </div>
              <div className="col">
                <p className='current-weather'><strong>Wind Direction:</strong> {weather.wind.deg}°</p>
                <p className='current-weather'><strong>Cloud Coverage:</strong> {weather.clouds.all}%</p>
                <p className='current-weather'><strong>Visibility:</strong> {weather.visibility / 1000} km</p>
                <p className='current-weather'><strong>Weather:</strong> {weather.weather[0]?.description}</p>
                <img src={`http://openweathermap.org/img/wn/${weather.weather[0]?.icon}.png`} alt="weather-icon" className="img-weather" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-loading">Loading current weather data...</p>
      )}

            {/* Next 48-Hour Forecast */}
            {futureWeather.length > 0 ? (
            <div className="card-nextweather">
                <div className="card-body">
                    <h2 className="card-txt-next-weather">Next 48 Hours Forecast</h2>
                    <div className="forecast-container">
                        {futureWeather.map((hourly, index) => (
                            <div className="forecast-item" key={index}>
                                <div className="nested-card">
                                    <div className="card-body2">
                                        <h6 className='nxt-weather-head'>{new Date(hourly.dt * 1000).toLocaleString()}</h6>
                                        <p className='nxt-weather-data'><strong>Temp:</strong> {hourly.main.temp}°C</p>
                                        <p className='nxt-weather-data'><strong>Weather:</strong> {hourly.weather[0]?.description}</p>
                                        <img 
                                            src={`http://openweathermap.org/img/wn/${hourly.weather[0]?.icon}.png`} 
                                            alt="weather-icon" 
                                            className="img-wather"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            ) : (
                <p className="text-loading">Loading future weather data...</p>
            )}

  {futureWeather.length === 0 && <p className="text-loading">Loading future weather data...</p>}


    </div>
  );
}

export default WeatherData;
