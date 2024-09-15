import React from "react";

function MaintenanceScheduler({ weatherData }) {
  function getWeatherCondition(weatherData) {
    if (weatherData && weatherData.weather && weatherData.weather.length > 0) {
      // Return the main weather condition
      return weatherData.weather[0].main;
    }
    return null;
  }

  function getWeatherResponse(weatherCondition) {
    const goodConditions = ["Clear", "Clouds"];

    if (weatherCondition) {
      if (goodConditions.includes(weatherCondition)) {
        return "Great day for outdoor work!";
      } else {
        const weatherEmoji = {
          Rain: "🌧️",
          Storm: "⛈️",
          Snow: "❄️",
          Drizzle: "🌦️",
          Clouds: "☁️",
          Clear: "☀️",
        };

        return `Not ideal for outdoor work. Current weather: ${weatherCondition} ${
          weatherEmoji[weatherCondition] || "🌫️"
        }`;
      }
    } else {
      return "Weather data is not available.";
    }
  }

  function getMaintenanceSuggestions(weatherCondition) {
    switch (weatherCondition) {
      case "Rain":
        return "Check drainage systems, inspect roofs for leaks, and ensure no outdoor items are left unsecured.";
      case "Storm":
        return "Secure outdoor furniture, inspect windows and doors, and monitor for flooding.";
      case "Snow":
        return "Check heating systems, clear snow from walkways, and inspect roofs for snow buildup.";
      case "Clear":
        return "Good day for exterior maintenance: clean windows, paint walls, or perform outdoor repairs.";
      case "Clouds":
        return "Mild weather, suitable for both outdoor and indoor maintenance work.";
      default:
        return "No specific maintenance suggestions for the current weather.";
    }
  }

  function checkForMoldRisk(humidity) {
    if (humidity > 60) {
      return "Warning: 🦠 High humidity levels detected! Inspect for mold in basements, bathrooms, and other moisture-prone areas 🧫.";
    }
    return null;
  }

  const currentWeatherCondition = getWeatherCondition(weatherData);
  const weatherResponse = getWeatherResponse(currentWeatherCondition);
  const maintenanceSuggestions = getMaintenanceSuggestions(
    currentWeatherCondition
  );
  const moldWarning = checkForMoldRisk(weatherData?.main?.humidity); // Access humidity data

  return (
    <div className="maintenance-scheduler">
      <h3>Maintenance Advice</h3>
      <p>{weatherResponse}</p>
      <h4>Maintenance Suggestions</h4>
      <p>{maintenanceSuggestions}</p>

      {moldWarning && (
        <div className="mold-warning">
          <h4>Mold Risk Warning</h4>
          <p>{moldWarning}</p>
        </div>
      )}
    </div>
  );
}

export default MaintenanceScheduler;
