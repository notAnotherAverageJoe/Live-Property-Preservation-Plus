import React from "react";
import { render, screen } from "@testing-library/react";
import MaintenanceScheduler from "../../components/WeatherAPI/MaintenanceScheduler";
import "@testing-library/jest-dom";

describe("MaintenanceScheduler", () => {
  it("displays a message for good weather conditions", () => {
    const weatherData = {
      weather: [{ main: "Clear" }],
      main: { humidity: 50 },
    };

    render(<MaintenanceScheduler weatherData={weatherData} />);

    expect(screen.getByText("Great day for outdoor work!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Good day for exterior maintenance: clean windows, paint walls, or perform outdoor repairs."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/Mold Risk Warning/)).toBeNull();
  });

  it("displays a message for poor weather conditions", () => {
    const weatherData = {
      weather: [{ main: "Rain" }],
      main: { humidity: 50 },
    };

    render(<MaintenanceScheduler weatherData={weatherData} />);

    expect(
      screen.getByText("Not ideal for outdoor work. Current weather: Rain 🌧️")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Check drainage systems, inspect roofs for leaks, and ensure no outdoor items are left unsecured."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/Mold Risk Warning/)).toBeNull();
  });

  it("handles missing weather data gracefully", () => {
    const weatherData = {};

    render(<MaintenanceScheduler weatherData={weatherData} />);

    expect(
      screen.getByText("Weather data is not available.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "No specific maintenance suggestions for the current weather."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(/Mold Risk Warning/)).toBeNull();
  });
});
