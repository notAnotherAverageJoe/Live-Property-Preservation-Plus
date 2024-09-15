const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const pool = require("../config/db");

// Function to get all users

// Function to get a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Convert ID to integer
  try {
    const user = await userModel.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

const createUser = async (req, res) => {
  const { email, role, company_id, first_name, last_name, password } = req.body;

  try {
    if (
      !email ||
      !role ||
      !company_id ||
      !first_name ||
      !last_name ||
      !password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10);

    // Pass passwordHash to userModel.createUser
    const newUser = await userModel.createUser({
      email,
      role,
      company_id,
      first_name,
      last_name,
      password_hash: passwordHash, // Ensure correct field name
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error); // Log error for debugging
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Function to update a user
const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Convert ID to integer
  const userData = req.body;
  try {
    const updatedUser = await userModel.updateUser(userId, userData);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10); // Convert ID to integer
  try {
    await userModel.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Function to login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in.", error: error.message });
  }
};

// Function to update user password
const updatePassword = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { oldPassword, newPassword } = req.body;

  try {
    const result = await userModel.updatePassword(
      userId,
      oldPassword,
      newPassword
    );
    res.json(result);
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM Users");
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getUsersByCompanyId = async (req, res) => {
  const companyId = req.user?.company_id; // Use correct field name from decoded token

  if (!companyId) {
    return res
      .status(400)
      .json({ message: "Company ID not found in user data" });
  }

  try {
    // Query to get users by company ID
    const users = await pool.query(
      "SELECT * FROM users WHERE company_id = $1",
      [companyId]
    );

    // Send users data as JSON response
    res.json(users.rows); // Make sure to send `users.rows` if using `pg` with Node.js
  } catch (error) {
    console.error("Error fetching users by company ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Function to get user profile by ID
const getUserProfile = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const userProfile = await userModel.getUserById(userId);
    if (userProfile) {
      res.status(200).json(userProfile);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

// Function to update user profile
const updateUserProfile = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userData = req.body;
  try {
    const updatedUser = await userModel.updateUser(userId, userData);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
};

// Function to delete user profile
const deleteUserProfile = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    await userModel.deleteUser(userId);
    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user profile", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  updatePassword,
  getUsersByCompanyId,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
