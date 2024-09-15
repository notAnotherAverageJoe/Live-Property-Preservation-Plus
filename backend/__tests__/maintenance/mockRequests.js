// mockRequests.js
module.exports = [
  {
    id: 1,
    description: "Fix faucet",
    unitId: 101,
    status: "pending",
  },
  {
    id: 2,
    description: "Replace light bulb",
    unitId: 102,
    status: "completed",
  },
]; // backend/__tests__/maintenance/mockRequests.js
const request = require("supertest");
const app = require("../../../server"); // Adjust the path to your app

describe("Maintenance Requests API", () => {
  it("should return a 404, these need a test isnide this folder.", async () => {
    const response = await request(app).get("/maintenance/requests");
    expect(response.status).toBe(404);
  });
});
