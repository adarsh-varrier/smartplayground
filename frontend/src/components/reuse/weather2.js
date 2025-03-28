import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/weather.css';

function WeatherData2({ id }) {
    const [weather, setWeather] = useState(null);
    const [futureWeather, setFutureWeather] = useState([]); // Next 48-hour weather
    const [error, setError] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        if (!id) {
            setError("Playground ID not available");
            return;
        }

        console.log("Fetching weather for ID:", id);
        const token = localStorage.getItem("authToken");

        const fetchWeather = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/playg-customer_weather/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                console.log("API Response:", response.data);
                setWeather(response.data.current_weather);
                setFutureWeather(response.data.next_48_hour_forecast.slice(0, 16)); // Show next 48 hours (every 3 hours)
            } catch (err) {
                setError("Failed to fetch weather data. Make sure you are logged in.");
                console.error("Error fetching weather:", err);
            }
        };

        const getCurrentDateTime = () => {
            const date = new Date();
            setCurrentDateTime(date.toLocaleString());
        };

        fetchWeather();
        getCurrentDateTime();
        const intervalId = setInterval(getCurrentDateTime, 60000); // Update time every 60 seconds

        return () => clearInterval(intervalId);
    }, [id]);

    if (error) return <p className="alert alert-danger">{error}</p>;
    if (!weather) return <p className="text-center">Loading weather...</p>;

    return (
        <div className="container my-4">
            {/* Current Date and Time */}
            <div className="mb-3 text-center">
                <h4>Current Date and Time: {currentDateTime}</h4>
            </div>

            {/* Current Weather */}
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

            {/* Next 48-Hour Forecast */}
        {futureWeather.length > 0 ? (
            <div className="card shadow-lg mb-4">
                <div className="card-body">
                    <h2 className="card-title text-center">Next 48 Hours Forecast</h2>
                    <div className="forecast-container">
                        {futureWeather.map((hourly, index) => (
                            <div className="forecast-item" key={index}>
                                <div className="card text-center">
                                    <div className="card-body">
                                        <h6>{new Date(hourly.dt * 1000).toLocaleString()}</h6>
                                        <p><strong>Temp:</strong> {hourly.main.temp}°C</p>
                                        <p><strong>Weather:</strong> {hourly.weather[0]?.description}</p>
                                        <img 
                                            src={`http://openweathermap.org/img/wn/${hourly.weather[0]?.icon}.png`} 
                                            alt="weather-icon" 
                                            className="img-fluid"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            ) : (
                <p className="text-center">Loading future weather data...</p>
            )}
        </div>
    );
}

export default WeatherData2;
