const request = require("supertest");
const app = require("../../../server");
const axios = require("axios");
jest.mock("axios");

describe("GET /api/weather", () => {
  const API_KEY = process.env.API_KEY;

  const mockWeatherData = {
    weather: [{ description: "clear sky" }],
    main: { temp: 75 },
    name: "Test City",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return weather data for a valid city", async () => {
    // Mock the axios GET request
    axios.get.mockResolvedValue({ data: mockWeatherData });

    const response = await request(app)
      .get("/api/weather")
      .query({ city: "Test City" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockWeatherData);
  });

  it("should return weather data for a valid city and state", async () => {
    // Mock the axios GET request
    axios.get.mockResolvedValue({ data: mockWeatherData });

    const response = await request(app)
      .get("/api/weather")
      .query({ city: "Test City", state: "CA" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockWeatherData);
  });

  it("should return 400 if city parameter is missing", async () => {
    const response = await request(app).get("/api/weather");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "City parameter is required" });
  });

  it("should handle errors from the weather API", async () => {
    // Mock the axios GET request to simulate an error
    axios.get.mockRejectedValue(new Error("Error fetching weather data"));

    const response = await request(app)
      .get("/api/weather")
      .query({ city: "Test City" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Error fetching weather data" });
  });
});
