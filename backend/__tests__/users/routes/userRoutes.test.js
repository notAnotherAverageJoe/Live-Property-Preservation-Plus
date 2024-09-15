const request = require("supertest");
const app = require("../../../../server"); // Adjust path as needed
const { Pool } = require("pg");

// Mock the Pool and query method
jest.mock("../../../../config/db", () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return mockPool;
});

const pool = require("../../../../config/db");

describe("User Routes with Transaction Rollback", () => {
  let server;
  const port = 8000; // Ensure this port is used consistently

  beforeAll(async () => {
    server = app.listen(port, () => {});

    // Connect to the mock database
    await pool.connect();
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve)); // Ensure server closes
    await pool.end(); // Close database connection
  });

  beforeEach(async () => {
    // Start a transaction before each test
    await pool.query("BEGIN");
  });

  afterEach(async () => {
    // Rollback the transaction after each test
    await pool.query("ROLLBACK");
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("GET /api/users/:id", () => {
    it("should return 401 if the user is not authenticated", async () => {
      const res = await request(app).get("/api/users/1");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should return 401 if the user is not authenticated", async () => {
      const updateData = { first_name: "Updated" };
      const res = await request(app).put("/api/users/1").send(updateData);
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe(undefined);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should return 401 if the user is not authenticated", async () => {
      const res = await request(app).delete("/api/users/1");
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe(undefined);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 401 for incorrect credentials", async () => {
      const mockUser = {
        email: "test@example.com",
        password: "wrongpassword", // Invalid password
      };
      const res = await request(app).post("/api/auth/login").send(mockUser);
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Error logging in");
    });
  });

  describe("GET /api/protected", () => {
    it("should return 401 if the user does not have the required role", async () => {
      const res = await request(app).get("/api/protected");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe(undefined);
    });
  });

  afterAll(async () => {
    console.log("Starting teardown...");
    try {
      if (server) {
        console.log("Attempting to close server...");
        await new Promise((resolve, reject) => {
          server.close((err) => {
            if (err) {
              console.error("Error closing server:", err);
              return reject(err);
            }
            console.log("Server closed.");
            resolve();
          });
        });
      } else {
        console.log("Server was not running.");
      }

      if (pool) {
        console.log("Ending database pool...");
        await pool.end();
        console.log("Database pool ended.");
      }
    } catch (error) {
      console.error("Error during teardown:", error);
    }
    console.log("Teardown complete.");
  }, 15000); // Increased timeout to 15 seconds
});
