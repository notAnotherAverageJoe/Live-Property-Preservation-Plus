import React from "react";

function EnergyManagement({ weatherData }) {
  function getTemperatureAdvice(tempF) {
    if (tempF < 60) {
      return "Consider increasing heating to maintain comfort.";
    } else if (tempF > 80) {
      return "Consider increasing cooling to maintain comfort.";
    } else {
      return "Temperature is within the comfortable range.";
    }
  }

  function getWeatherAdvice(weatherCondition) {
    const weatherAdvice = {
      Rain: "Rainy weather might increase humidity; consider using a dehumidifier in order to avoid mold growth.",
      Snow: "Snowy weather may require increased heating. Ensure your heating system is functioning well. Keep outdoor units clear of snow coverage.",
      Clear:
        "Clear weather is ideal for energy savings. Use natural light and fresh air.",
      Clouds:
        "Cloudy weather may slightly reduce solar heating. Adjust heating or cooling as needed.",
      Drizzle:
        "Drizzly weather might be similar to rainy weather in terms of humidity. Consider dehumidification.",
      Storm:
        "Stormy weather can affect heating and cooling efficiency. Ensure your systems are well-maintained.",
    };

    return (
      weatherAdvice[weatherCondition] ||
      "No specific advice for current weather condition."
    );
  }

  function getHumidityAdvice(humidity) {
    if (humidity > 60) {
      return "High humidity levels detected. Consider using dehumidifiers to maintain a comfortable indoor environment and prevent mold growth.";
    }
    return "Humidity levels are comfortable. No additional action needed.";
  }

  function getTimeOfDayAdvice() {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      return "It's off-peak hours. Consider using high-energy appliances during this time for cost savings.";
    } else {
      return "It's peak hours. Be mindful of energy usage to avoid high electricity costs.";
    }
  }

  function getSeasonalAdvice() {
    const month = new Date().getMonth();
    if (month >= 11 || month <= 1) {
      return "Winter is here. Ensure your heating systems are optimized, and consider sealing any drafts to improve energy efficiency.";
    } else if (month >= 5 && month <= 8) {
      return "Summer is here. Use ceiling fans and keep blinds closed during the hottest parts of the day to reduce cooling costs.";
    }
    return "No specific seasonal advice at this time.";
  }

  if (!weatherData) {
    return <p>No weather data available.</p>;
  }

  const tempF = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const weatherCondition = weatherData.weather[0].main;

  return (
    <div className="energy-management">
      <h3>Energy Management Recommendations</h3>
      {/* Temperature-based Advice */}
      <p>{getTemperatureAdvice(tempF)}</p>

      {/* Weather-based Advice */}
      <p>{getWeatherAdvice(weatherCondition)}</p>

      {/* Humidity-based Advice */}
      <h4>Humidity</h4>
      <p>{getHumidityAdvice(humidity)}</p>

      {/* Time of Day-based Advice */}
      <h4>Peak times for Energy use</h4>
      <p>{getTimeOfDayAdvice()}</p>

      {/* Seasonal Advice */}
      <h4>Seasonal Advice</h4>
      <p>{getSeasonalAdvice()}</p>
    </div>
  );
}

export default EnergyManagement;
