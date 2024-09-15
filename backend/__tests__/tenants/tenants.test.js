const request = require("supertest");
const app = require("../../../server");
const pool = require("../../../config/db");

// Mock pool.query method
jest.mock("../../../config/db");

describe("Tenants API", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset mocks before each test
  });

  // Test for getting all tenants
  it("should return all tenants", async () => {
    const mockTenants = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        property_id: 1,
        company_id: 1,
      },
      // Add more mock tenants as needed
    ];

    pool.query.mockResolvedValue({ rows: mockTenants }); // Mock the database response

    const response = await request(app).get("/api/tenants");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTenants);
  });

  // Test for getting a tenant by ID
  it("should return a tenant by ID", async () => {
    const mockTenant = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      property_id: 1,
      company_id: 1,
    };

    // Mock the database response
    pool.query.mockResolvedValue({ rows: mockTenant });

    // Make the request
    const response = await request(app).get("/api/tenants/1");

    // Assert that the status is 200
    expect(response.status).toBe(200);

    // Assert that the response body contains the tenant object
    expect(response.body).toEqual(mockTenant);
  });

  // Test for creating a new tenant
  it("should create a new tenant", async () => {
    const newTenant = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      phone: "0987654321",
      property_id: 2,
      company_id: 2,
    };
    const createdTenant = { id: 2, ...newTenant };

    pool.query.mockResolvedValue({ rows: [createdTenant] }); // Mock the database response

    const response = await request(app).post("/api/tenants").send(newTenant);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdTenant);
  });

  // Test for updating a tenant
  it("should update a tenant", async () => {
    const updatedTenant = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      property_id: 1,
      company_id: 1,
    };

    pool.query.mockResolvedValue({ rows: [updatedTenant] }); // Mock the database response

    const response = await request(app)
      .put("/api/tenants/1")
      .send(updatedTenant);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedTenant);
  });

  // Test for deleting a tenant
  it("should delete a tenant", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 }); // Mock the database response

    const response = await request(app).delete("/api/tenants/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ msg: "Tenant deleted" });
  });
});
