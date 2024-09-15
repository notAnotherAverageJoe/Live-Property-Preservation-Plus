import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";
import MaintenanceScheduler from "./MaintenanceScheduler";
import EnergyManagement from "./EnergyManagement";

function Weather() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, []);

  const fetchWeatherData = async (city, state, retries = 3) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/weather?city=${city}&state=${state}`
      );
      return response.data;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying... Attempts left: ${retries}`);
        await new Promise((res) => setTimeout(res, 1000)); // Wait before retrying
        return fetchWeatherData(city, state, retries - 1);
      } else {
        throw error;
      }
    }
  };

  const handleWeatherFetch = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWeatherData(city, state);
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      console.error(
        "Error details:",
        error.response ? error.response.data : error
      );
      // Provide user feedback if needed
    }
  };

  function getWeatherEmoji(weatherCondition) {
    const weatherEmoji = {
      Rain: "🌧️",
      Storm: "⛈️",
      Snow: "❄️",
      Drizzle: "🌦️",
      Clouds: "☁️",
      Clear: "☀️",
    };

    return weatherEmoji[weatherCondition] || "🌫️"; // Default emoji if condition is not matched
  }

  return (
    <div className="weather-dashboard">
      <h2>Maintenance Guide</h2>

      {/* Clock */}
      <div className="clock">
        <h3>{time.toLocaleTimeString()}</h3>
      </div>

      {/* Weather Form */}
      <form onSubmit={handleWeatherFetch}>
        <label htmlFor="city">Enter City Name: </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label htmlFor="state">
          <br></br>State/Region:{" "}
        </label>
        <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>

      {/* Weather Info */}
      {weather && (
        <>
          <div className="weather-info">
            <h3>Weather in {weather.name}</h3>
            <p>
              <strong>Temperature:</strong> {weather.main.temp}°F
            </p>
            <p>
              <strong>Weather:</strong> {weather.weather[0].description}{" "}
              {getWeatherEmoji(weather.weather[0].main)}
            </p>
            <p>
              <strong>Humidity:</strong> {weather.main.humidity}%
            </p>
          </div>

          {/* MaintenanceScheduler Component */}
          <div className="maintenance-scheduler">
            <MaintenanceScheduler weatherData={weather} />
          </div>

          {/* EnergyManagement Component */}
          <div className="energy-management">
            <EnergyManagement weatherData={weather} />
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
