jest.mock("../../../middleware/authenticate", () => (req, res, next) => {
  // Simulate a successful authentication by attaching a mock user to the request
  req.user = { id: 1, company_id: 123 };
  next();
});

const request = require("supertest");
const app = require("../../../server");
const db = require("../../../config/db");

jest.mock("../../../config/db", () => ({
  query: jest.fn(),
}));

// Mock property data
const mockPropertyData = {
  name: "Test Property",
  location: "123 Test Street",
  company_id: 123,
  address: "456 Test Avenue",
};

const mockProperty = {
  id: 1,
  name: "Test Property",
  location: "123 Test Street",
};

describe("Properties API", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should create a property successfully", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ company_id: 123 }] });
    db.query.mockResolvedValueOnce({ rows: [mockProperty] });

    const response = await request(app)
      .post("/api/properties")
      .send(mockPropertyData)
      .set("Authorization", `Bearer mocked_token`); // Set a mock token

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockProperty);
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it("should return an error if property creation fails", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ company_id: 123 }] });
    db.query.mockRejectedValueOnce(new Error("Failed to create property"));

    const response = await request(app)
      .post("/api/properties")
      .send(mockPropertyData)
      .set("Authorization", `Bearer mocked_token`); // Set a mock token

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Failed to create property: Failed to create property",
    });
    expect(db.query).toHaveBeenCalledTimes(2);
  });
});
