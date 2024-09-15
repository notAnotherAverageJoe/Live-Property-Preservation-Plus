const express = require("express");
const router = express.Router(); // Initialize the router
const pool = require("../config/db"); // Make sure you have your database pool setup

// Create a new maintenance request for a specific unit
router.post("/:unitId/requests", async (req, res) => {
  const { unitId } = req.params;
  const { request_description } = req.body;

  try {
    const newRequest = await pool.query(
      `INSERT INTO MaintenanceRequests (unit_id, request_description) 
             VALUES ($1, $2) RETURNING *`,
      [unitId, request_description]
    );
    res.json(newRequest.rows[0]);
  } catch (err) {}
});

// Get all maintenance requests for a specific unit
router.get("/:unitId/requests", async (req, res) => {
  const { unitId } = req.params;

  try {
    const requests = await pool.query(
      `SELECT * FROM MaintenanceRequests WHERE unit_id = $1`,
      [unitId]
    );
    res.json(requests.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a maintenance request
router.put("/requests/:id", async (req, res) => {
  const { id } = req.params;
  const { request_description, status } = req.body;

  try {
    const updatedRequest = await pool.query(
      `UPDATE MaintenanceRequests 
             SET request_description = $1, status = $2, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $3 RETURNING *`,
      [request_description, status, id]
    );
    res.json(updatedRequest.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a maintenance request
router.delete("/requests/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM MaintenanceRequests WHERE id = $1`, [id]);
    res.json({ message: "Maintenance request deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
