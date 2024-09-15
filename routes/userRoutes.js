const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");
const companyController = require("../controllers/companyController");
const pool = require("../config/db");
const userModel = require("../models/userModel");

// Route to get a specific user by ID
router.get("/users/:id", authenticate, userController.getUserById);

// Route to create a new user
router.post("/users", authenticate, userController.createUser);

// Route to update a user
router.put("/users/:id", authenticate, userController.updateUser);

// Route to delete a user
router.delete("/users/:id", authenticate, userController.deleteUser);

// Route to login a user
router.post("/login", userController.loginUser);

// Route to update user password
router.put("/users/:id/password", authenticate, userController.updatePassword);

// Route to update company information and refresh token
router.post("/updateCompany", authenticate, companyController.updateCompany);

router.get("/users", authenticate, userController.getUsersByCompanyId);

// Route to get a user's profile by ID
router.get("/profile/:id", authenticate, userController.getUserProfile);

// Route to update a user's profile
router.put("/profile/:id", authenticate, userController.updateUserProfile);

// Route to delete a user's profile
router.delete("/profile/:id", authenticate, userController.deleteUserProfile);

router.get("/api/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/api/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { first_name, last_name, email } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *",
      [first_name, last_name, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.delete("/api/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// Change password endpoint
router.put("/api/users/:id/password", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both oldPassword and newPassword are required" });
    }

    const result = await userModel.updatePassword(
      userId,
      oldPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
