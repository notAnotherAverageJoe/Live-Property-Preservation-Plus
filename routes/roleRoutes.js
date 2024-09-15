const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const pool = require("../config/db");
const authenticate = require("../middleware/authenticate");

// // Route to get all roles
// router.get("/roles", roleController.getAllRoles);

// Route to get a role by ID
router.get("/roles/:id", roleController.getRoleById);

router.get("/roles", authenticate, roleController.getRolesByUserId);

// Route to create a new role
router.post("/roles", authenticate, roleController.createRole);

// Route to delete a role
router.delete("/roles/:id", roleController.deleteRole);

router.post("/api/roles", async (req, res) => {
  const { name, access_level, company_id, user_id } = req.body;

  // Ensure access_level is between 1 and 5 and not null
  if (!name || !access_level || access_level < 1 || access_level > 5) {
    return res
      .status(400)
      .json({ message: "Invalid role name or access level." });
  }

  try {
    const newRole = await db.query(
      `INSERT INTO roles (name, access_level, company_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, access_level, company_id, user_id]
    );
    res.json({ message: "Role created successfully", role: newRole.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating role" });
  }
});

module.exports = router;
