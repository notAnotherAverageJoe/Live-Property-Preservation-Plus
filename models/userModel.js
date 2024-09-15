const pool = require("../config/db");

// Function to get all users

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email FROM Users"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Function to get user by ID
const getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving user: " + error.message);
  }
};

// models/userModel.js

const createUser = async (userData) => {
  try {
    const { company_id, first_name, last_name, email, password_hash } =
      userData;
    const result = await pool.query(
      "INSERT INTO Users (company_id, first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [company_id, first_name, last_name, email, password_hash]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

// Function to update a user, including company_id
const updateUser = async (id, userData) => {
  try {
    const { firstName, lastName, email, passwordHash, companyId } = userData;
    const result = await pool.query(
      "UPDATE Users SET first_name = $1, last_name = $2, email = $3, password_hash = $4, company_id = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [firstName, lastName, email, passwordHash, companyId, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

// Function to delete a user
const deleteUser = async (id) => {
  try {
    await pool.query("DELETE FROM Users WHERE id = $1", [id]);
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};

const getUsersByCompanyId = async (companyId) => {
  const query = "SELECT * FROM users WHERE company_id = $1";
  const values = [companyId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw the error to be caught in the controller
  }
};

const bcrypt = require("bcrypt");
const updatePassword = async (userId, oldPassword, newPassword) => {
  try {
    // Retrieve user by ID
    const result = await pool.query(
      "SELECT password_hash FROM Users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];
    if (!user) {
      throw new Error("User not found");
    }

    // Compare old password with stored hash
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      throw new Error("Incorrect old password");
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await pool.query("UPDATE Users SET password_hash = $1 WHERE id = $2", [
      hashedNewPassword,
      userId,
    ]);

    return { message: "Password updated successfully" };
  } catch (error) {
    throw new Error("Error updating password: " + error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByCompanyId,
  updatePassword,
};
