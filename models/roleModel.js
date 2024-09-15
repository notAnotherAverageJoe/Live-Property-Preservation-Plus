const pool = require("../config/db");

// Function to get all roles
const getAllRoles = async () => {
  try {
    const result = await pool.query("SELECT * FROM Roles");
    return result.rows;
  } catch (error) {
    throw new Error("Error retrieving roles: " + error.message);
  }
};

// Function to get a role by ID
const getRoleById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Roles WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving role: " + error.message);
  }
};

// Function to create a new role
const createRole = async (req, res) => {
  const { name } = req.body;
  const user_id = req.user.id; // Extract user_id from the token

  if (!name || !user_id) {
    return res
      .status(400)
      .json({ message: "Role name and user_id are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO Roles (name, user_id) VALUES ($1, $2) RETURNING *",
      [name, user_id]
    );
    res.status(201).json({
      message: `Role '${result.rows[0].name}' created successfully.`,
      role: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Role already exists." });
    }
    res.status(500).json({ message: "Error creating role." });
  }
};

// Function to delete a role
const deleteRole = async (id) => {
  try {
    await pool.query("DELETE FROM Roles WHERE id = $1", [id]);
    return { message: "Role deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting role: " + error.message);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  deleteRole,
};
