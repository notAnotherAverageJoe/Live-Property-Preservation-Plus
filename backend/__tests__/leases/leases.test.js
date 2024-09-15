const request = require("supertest");
const app = require("../../../server");

const pool = require("../../../config/db");

const leaseModel = require("../../../models/leaseModel");

jest.mock("../../../models/leaseModel");
jest.mock("../../../config/db", () => ({
  query: jest.fn(),
}));
// Test getting a lease by ID
describe("GET /api/leases/:id", () => {
  it("should return a lease if it exists", async () => {
    const lease = {
      id: 1,
      unit_id: 101,
      tenant_id: 1,
      rent_amount: 1500,
      status: "active",
    };

    leaseModel.getLeaseById.mockResolvedValue(lease);

    const response = await request(app).get("/api/leases/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(lease);
  });

  it("should return 404 if the lease is not found", async () => {
    leaseModel.getLeaseById.mockResolvedValue(null);

    const response = await request(app).get("/api/leases/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Lease not found" });
  });
});

// Test creating a new lease
describe("POST /api/leases", () => {
  it("should fail to create a new lease if fields are missing", async () => {
    const response = await request(app).post("/api/leases").send({});

    expect(response.status).toBe(400); // 400 for bad request
    expect(response.body).toEqual({
      message: "All fields are required.",
    });
  });
});

// Test updating a lease
describe("PUT /api/leases/:id", () => {});

it("should return 400 if required fields are missing", async () => {
  const response = await request(app).put("/api/leases/1").send({});

  expect(response.status).toBe(400); // 400 for bad request
  expect(response.body).toEqual({ message: "All fields are required." });
});

// Test deleting a lease
describe("DELETE /api/leases/:id", () => {
  it("should delete a lease", async () => {
    leaseModel.deleteLease.mockResolvedValue();

    const response = await request(app).delete("/api/leases/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Lease deleted successfully" });
  });

  it("should handle errors", async () => {
    leaseModel.deleteLease.mockRejectedValue(new Error("DB Error"));

    const response = await request(app).delete("/api/leases/1");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error deleting lease",
      error: "DB Error",
    });
  });
});
