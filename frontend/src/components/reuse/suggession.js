import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../styles/suggession.css';

const PlaygroundWeatherUV = ({ playgId }) => {
    const [weather, setWeather] = useState(null);
    const [uvData, setUvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suggestion, setSuggestion] = useState("");

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    setError("Authentication token not found!");
                    setLoading(false);
                    return;
                }

                const headers = {
                    Authorization: `Token ${token}`,
                };

                // Fetch weather data
                const weatherResponse = await axios.get(
                    `http://127.0.0.1:8000/api/playg-customer_weather/${playgId}/`,
                    { headers }
                );
                const weatherData = weatherResponse.data.current_weather;

                // Fetch UV index data
                const uvResponse = await axios.get(
                    `http://127.0.0.1:8000/api/playground/${playgId}/uv-data/`,
                    { headers }
                );
                const uvIndex = uvResponse.data.uv_index;

                setWeather(weatherData);
                setUvData(uvResponse.data);
                generateSuggestion(weatherData, uvIndex);
            } catch (err) {
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [playgId, token]);

    // Function to generate suggestions based on weather and UV index
    const generateSuggestion = (weatherData, uvIndex) => {
        let msg = "✅ The weather is good for outdoor activities.";
    
        if (weatherData.weather[0]?.main === "Rain") {
            msg = "🌧️ It's raining. Playing might not be safe.";
        } else if (weatherData.weather[0]?.main === "Thunderstorm") {
            msg = "⚡ Thunderstorms expected! Avoid outdoor activities.";
        } else if (weatherData.main.temp > 35) {
            msg = "🔥 It's very hot outside. Stay hydrated and wear light clothes.";
        } else if (weatherData.main.temp < 15) {
            msg = "🥶 It's cold. Wear warm clothes while playing.";
        } else if (uvIndex >= 8) {
            msg = "🌞 High UV index detected! Use sunscreen and wear a hat.";
        } else if (uvIndex >= 6) {
            msg = "☀️ Moderate UV risk. Apply SPF 30+ sunscreen.";
        }
    
        setSuggestion(msg);
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="weather-uv-container">
            <h2>🌦 Playground Weather & UV Index</h2>
            <div className="row">
                <div className="col">
                {/* Weather Information */}
                <div className="weather-info">
                    <h3>{weather.name}, {weather.sys?.country}</h3>
                    <p><strong>🌡️ Temperature:</strong> {weather.main.temp}°C</p>
                    <p><strong>🌬 Wind Speed:</strong> {weather.wind.speed} m/s</p>
                    <p><strong>🌧️ Condition:</strong> {weather.weather[0]?.description}</p>
                    <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                    <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
                    <img src={`http://openweathermap.org/img/wn/${weather.weather[0]?.icon}.png`} alt="Weather Icon" />
                </div>
                </div>
                <div className="col">
                {/* UV Data */}
                <div className="uv-info">
                    <p><strong>☀️ UV Index:</strong> {uvData.uv_index}</p>
                    <p><strong>⚠️ Max UV Today:</strong> {uvData.uv_max}</p>
                    <p><strong>🕒 Peak UV Time:</strong> {new Date(uvData.uv_max_time).toLocaleTimeString()}</p>
                    <p><strong>🌍 Ozone Level:</strong> {uvData.ozone} DU</p>
                </div>
                </div>
            </div>
            <div className="row">
            {/* Suggestion Section */}
            <div className="suggestion-box">
                <h3>📢 Safety Suggestion</h3>
                <p>{suggestion}</p>
            </div>
            </div>
        </div>
    );
};

export default PlaygroundWeatherUV;
