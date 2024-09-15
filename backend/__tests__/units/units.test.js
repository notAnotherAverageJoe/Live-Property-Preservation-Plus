const request = require("supertest");
const app = require("../../../server");
const pool = require("../../../config/db");

jest.mock("../../../middleware/authenticate", () => (req, res, next) => next());

describe("Unit Endpoints", () => {
  let unitId;
  const propertyId = 12534545444543454332324533322577542;
  let client;

  beforeAll(async () => {
    client = await pool.connect();
    await client.query("BEGIN"); // Start a transaction
  });

  afterEach(async () => {
    await client.query("ROLLBACK"); // Rollback the transaction
  });

  afterAll(async () => {
    await client.query("COMMIT"); // Commit the transaction if all tests are successful
    client.release();
  });

  // Test for creating a new unit
  it("should create a new unit", async () => {
    const response = await request(app)
      .post(`/api/properties/${propertyId}/units`) // Updated endpoint
      .send({
        unit_number: "101",
        type: "Apartment",
        rent_amount: 1200,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.unit_number).toBe("101");
    unitId = response.body.id;
  });

  // Test for updating a unit
  it("should update a unit", async () => {
    const response = await request(app)
      .put(`/api/units/${unitId}`) // Updated endpoint
      .send({
        unit_number: "102",
        type: "Penthouse",
        rent_amount: 1500,
      });

    expect(response.status).toBe(200);
    expect(response.body.unit_number).toBe("102");
  });

  // Test for deleting a unit
  it("should delete a unit", async () => {
    const response = await request(app).delete(`/api/units/${unitId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Unit deleted successfully");
  });
});
