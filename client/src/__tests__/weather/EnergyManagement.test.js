import React from "react";
import { render, screen } from "@testing-library/react";
import EnergyManagement from "../../components/WeatherAPI/EnergyManagement";
import "@testing-library/jest-dom";

describe("EnergyManagement", () => {
  it("displays advice based on temperature", () => {
    const weatherData = {
      main: { temp: 50, humidity: 50 },
      weather: [{ main: "Clear" }],
    };

    render(<EnergyManagement weatherData={weatherData} />);

    expect(
      screen.getByText("Consider increasing heating to maintain comfort.")
    ).toBeInTheDocument();
  });

  it("displays advice for different weather conditions", () => {
    const weatherData = {
      main: { temp: 70, humidity: 50 },
      weather: [{ main: "Rain" }],
    };

    render(<EnergyManagement weatherData={weatherData} />);

    expect(
      screen.getByText(
        "Rainy weather might increase humidity; consider using a dehumidifier in order to avoid mold growth."
      )
    ).toBeInTheDocument();
  });

  it("displays advice for high humidity", () => {
    const weatherData = {
      main: { temp: 70, humidity: 65 },
      weather: [{ main: "Clear" }],
    };

    render(<EnergyManagement weatherData={weatherData} />);

    expect(
      screen.getByText(
        "High humidity levels detected. Consider using dehumidifiers to maintain a comfortable indoor environment and prevent mold growth."
      )
    ).toBeInTheDocument();
  });

  it("displays no data message when weatherData is missing", () => {
    render(<EnergyManagement weatherData={null} />);

    expect(screen.getByText("No weather data available.")).toBeInTheDocument();
  });
});
