const request = require("supertest");
const app = require("../../../server");
const userRoleModel = require("../../../models/userRoleModel");

// Mock the userRoleModel
jest.mock("../../../models/userRoleModel");

jest.mock("../../../middleware/authenticate", () => (req, res, next) => next());

describe("User Role Controller Tests", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Clear mocks before each test
  });

  describe("Assign Role to User", () => {
    it("should assign a role to a user successfully", async () => {
      // Mock the model function
      userRoleModel.assignRoleToUser.mockResolvedValue({
        userId: 1,
        roleId: 2,
      });

      const res = await request(app)
        .post("/api/user-roles")
        .send({ userId: 1, roleId: 2 });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        userId: 1,
        roleId: 2,
      });
    });

    it("should return 500 if there's an error assigning the role", async () => {
      // Mock the model function to throw an error
      userRoleModel.assignRoleToUser.mockRejectedValue(new Error("Some error"));

      const res = await request(app)
        .post("/api/user-roles")
        .send({ userId: 1, roleId: 2 });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toBe("Error assigning role to user");
    });
  });

  describe("Get Roles by User Id", () => {
    it("should return roles for a user successfully", async () => {
      // Mock the model function
      userRoleModel.getRolesByUserId.mockResolvedValue([
        { roleId: 1, roleName: "Admin" },
        { roleId: 2, roleName: "User" },
      ]);

      const res = await request(app).get("/api/user-roles/1");

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([
        { roleId: 1, roleName: "Admin" },
        { roleId: 2, roleName: "User" },
      ]);
    });

    it("should return 500 if there's an error retrieving roles", async () => {
      // Mock the model function to throw an error
      userRoleModel.getRolesByUserId.mockRejectedValue(new Error("Some error"));

      const res = await request(app).get("/api/user-roles/1");

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toBe("Error retrieving roles for user");
    });
  });
});
