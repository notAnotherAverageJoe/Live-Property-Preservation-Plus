const roleController = require("../../../controllers/roleController");
const { Pool } = require("pg");

// Mock the pool.query method
jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const mockPool = new Pool();
const mockReq = {};
const mockRes = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

describe("Role Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createRole", () => {
    it("should create a new role", async () => {
      const mockRole = {
        id: 1,
        name: "Admin",
        access_level: 5,
        company_id: 2,
        user_id: 3,
      };
      const mockReq = {
        body: { name: "Admin", access_level: 5, company_id: 2, user_id: 3 },
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockRole] });

      await roleController.createRole(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith(
        `INSERT INTO roles (name, access_level, company_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        ["Admin", 5, 2, 3]
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Role created successfully",
        role: mockRole,
      });
    });

    it("should return 400 if invalid data is provided", async () => {
      const mockReq = {
        body: { name: "", access_level: 0, company_id: 2, user_id: 3 },
      };

      await roleController.createRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid role name or access level.",
      });
    });

    it("should return 500 on error", async () => {
      const errorMessage = "Error creating role";
      const mockReq = {
        body: { name: "Admin", access_level: 5, company_id: 2, user_id: 3 },
      };

      mockPool.query.mockRejectedValueOnce(new Error(errorMessage));

      await roleController.createRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error creating role",
      });
    });
  });

  describe("getRolesByUserId", () => {
    it("should fetch roles by user ID", async () => {
      const mockRoles = [
        { id: 1, name: "Admin", access_level: 5, company_id: 2, user_id: 3 },
      ];
      const mockReq = { user: { id: 3 } };

      mockPool.query.mockResolvedValueOnce({ rows: mockRoles });

      await roleController.getRolesByUserId(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith(
        `SELECT * FROM roles WHERE user_id = $1`,
        [3]
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockRoles);
    });

    it("should return 500 on error", async () => {
      const errorMessage = "Error fetching roles";
      const mockReq = { user: { id: 3 } };

      mockPool.query.mockRejectedValueOnce(new Error(errorMessage));

      await roleController.getRolesByUserId(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching roles",
      });
    });
  });

  describe("getRoleById", () => {
    it("should fetch a role by ID", async () => {
      const mockRole = {
        id: 1,
        name: "Admin",
        access_level: 5,
        company_id: 2,
        user_id: 3,
      };
      const mockReq = { params: { id: 1 } };

      mockPool.query.mockResolvedValueOnce({ rows: [mockRole] });

      await roleController.getRoleById(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith(
        `SELECT * FROM roles WHERE id = $1`,
        [1]
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockRole);
    });

    it("should return 404 if role not found", async () => {
      const mockReq = { params: { id: 1 } };

      mockPool.query.mockResolvedValueOnce({ rows: [] });

      await roleController.getRoleById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Role not found" });
    });

    it("should return 500 on error", async () => {
      const errorMessage = "Error fetching role";
      const mockReq = { params: { id: 1 } };

      mockPool.query.mockRejectedValueOnce(new Error(errorMessage));

      await roleController.getRoleById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching role",
      });
    });
  });

  describe("deleteRole", () => {
    it("should delete a role", async () => {
      const mockReq = { params: { id: 1 } };

      mockPool.query.mockResolvedValueOnce({});

      await roleController.deleteRole(mockReq, mockRes);

      expect(mockPool.query).toHaveBeenCalledWith(
        `DELETE FROM roles WHERE id = $1`,
        [1]
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Role deleted successfully",
      });
    });

    it("should return 500 on error", async () => {
      const errorMessage = "Error deleting role";
      const mockReq = { params: { id: 1 } };

      mockPool.query.mockRejectedValueOnce(new Error(errorMessage));

      await roleController.deleteRole(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error deleting role",
      });
    });
  });

  it("should return 400 if access level is out of range", async () => {
    const mockReq = {
      body: { name: "Admin", access_level: 6, company_id: 2, user_id: 3 },
    };

    await roleController.createRole(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid role name or access level.",
    });
  });

  it("should return 400 if name is empty", async () => {
    const mockReq = {
      body: { name: "", access_level: 3, company_id: 2, user_id: 3 },
    };

    await roleController.createRole(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid role name or access level.",
    });
  });
});
