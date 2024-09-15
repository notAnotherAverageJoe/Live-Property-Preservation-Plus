const pool = require("../config/db");

// Create a new role
exports.createRole = async (req, res) => {
  const { name, access_level, company_id, user_id } = req.body;

  // Validate access level and role name
  if (!name || !access_level || access_level < 1 || access_level > 5) {
    return res
      .status(400)
      .json({ message: "Invalid role name or access level." });
  }

  try {
    const newRole = await pool.query(
      `INSERT INTO roles (name, access_level, company_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, access_level, company_id, user_id]
    );
    res.json({ message: "Role created successfully", role: newRole.rows[0] });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role" });
  }
};

exports.getRolesByUserId = async (req, res) => {
  const userId = req.user.id; // Assuming you've got authentication middleware that sets req.user
  try {
    const roles = await pool.query(`SELECT * FROM roles WHERE user_id = $1`, [
      userId,
    ]);
    res.json(roles.rows);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Error fetching roles" });
  }
};

// Fetch a single role by ID
exports.getRoleById = async (req, res) => {
  const roleId = req.params.id;
  try {
    const role = await pool.query(`SELECT * FROM roles WHERE id = $1`, [
      roleId,
    ]);
    if (role.rows.length === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json(role.rows[0]);
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ message: "Error fetching role" });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  const roleId = req.params.id;
  try {
    await pool.query(`DELETE FROM roles WHERE id = $1`, [roleId]);
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role" });
  }
};
