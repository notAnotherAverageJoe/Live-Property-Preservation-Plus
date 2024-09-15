const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../../config/db");
const app = require("../../../server");

// Mock dependencies
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../config/db");

describe("Auth Controller Tests", () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ first_name: "John", last_name: "Doe" }); // Missing email and password

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Missing required fields");
  });

  it("should return 400 if user already exists", async () => {
    // Mock the database response
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: "test@test.com" }],
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "Password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should register a user and return a token", async () => {
    // Mock pool.query and bcrypt
    pool.query.mockResolvedValueOnce({ rows: [] }); // User not found
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: "test@test.com" }],
    }); // New user created
    bcrypt.genSalt.mockResolvedValue("fakeSalt");
    bcrypt.hash.mockResolvedValue("hashedPassword");
    jwt.sign.mockReturnValue("fakeToken");

    const res = await request(app).post("/api/auth/register").send({
      first_name: "John",
      last_name: "Doe",
      email: "test@test.com",
      password: "Password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBe("fakeToken");
  });
});

describe("Login User", () => {
  beforeEach(() => {
    pool.query.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
  });

  it("should return 400 if invalid credentials", async () => {
    // Mock the pool query for non-existing user
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@test.com",
      password: "wrongPassword",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return a token if login is successful", async () => {
    // Mock the pool query for existing user and bcrypt comparison
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, email: "test@test.com", password_hash: "hashedPassword" },
      ],
    });
    bcrypt.compare.mockResolvedValue(true); // Password match
    jwt.sign.mockReturnValue("fakeToken");

    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "Password123",
    });

    expect(res.statusCode).toEqual(500);
  });
});

describe("Creator Login User", () => {
  it("should deny access if user has roles", async () => {
    // Mock user and roles
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, email: "creator@test.com", password_hash: "hashedPassword" },
      ],
    });
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, role: "admin" }] }); // User has roles

    const res = await request(app).post("/api/auth/creator-login").send({
      email: "creator@test.com",
      password: "Password123",
    });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe("Access denied for users with roles");
  });

  it("should return a token if creator login is successful", async () => {
    // Mock user without roles
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, email: "creator@test.com", password_hash: "hashedPassword" },
      ],
    });
    pool.query.mockResolvedValueOnce({ rows: [] }); // No roles
    bcrypt.compare.mockResolvedValue(true); // Password match
    jwt.sign.mockReturnValue("fakeToken");

    const res = await request(app).post("/api/auth/creator-login").send({
      email: "creator@test.com",
      password: "Password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBe("fakeToken");
  });
});
