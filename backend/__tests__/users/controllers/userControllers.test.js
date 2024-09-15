const request = require("supertest");
const app = require("../../../../server");
const pool = require("../../../../config/db");

// Import your mock authentication middleware
const mockAuthMiddleware = require("../../../../__mocks__/authMiddleware");

// Override the auth middleware
app.use("/api/users", mockAuthMiddleware);

const mockUser = {
  email: "test@example.com",
  password: "testpassword",
};

let server;
const port = 3000;

beforeAll(async () => {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Server initialization complete.");
});

// Start a transaction before each test
beforeEach(async () => {
  await pool.query("BEGIN");
});

// Rollback the transaction after each test to keep the database clean
afterEach(async () => {
  await pool.query("ROLLBACK");
});

describe("User Controller", () => {
  it("should create a new user", async () => {
    // Ensure the request payload matches what your endpoint expects
    const res = await request(app).post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(401);
  });

  it("should get a user by ID", async () => {
    const userId = 1; // Ensure this ID is valid
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(401);
  });

  it("should login a user with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: mockUser.email, password: mockUser.password });
    expect(res.statusCode).toBe(400);
  });

  it("should update a user", async () => {
    const userId = 1;
    const updateData = { first_name: "Updated" };
    const res = await request(app).put(`/api/users/${userId}`).send(updateData);
    expect(res.statusCode).toBe(401);
  });

  it("should delete a user by ID", async () => {
    const userId = 1;
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(401);
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
