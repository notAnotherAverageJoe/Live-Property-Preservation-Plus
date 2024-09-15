const pool = require("../config/db");

// Function to get all maintenance requests
const getAllMaintenanceRequests = async () => {
  try {
    const result = await pool.query("SELECT * FROM MaintenanceRequests");
    return result.rows;
  } catch (error) {
    throw new Error("Error retrieving maintenance requests: " + error.message);
  }
};

// Function to get a maintenance request by ID
const getMaintenanceRequestById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM MaintenanceRequests WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving maintenance request: " + error.message);
  }
};

// Function to create a new maintenance request
const createMaintenanceRequest = async (requestData) => {
  try {
    const { unitId, requestDescription, requestDate, status } = requestData;
    const result = await pool.query(
      "INSERT INTO MaintenanceRequests (unit_id, request_description, request_date, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [unitId, requestDescription, requestDate, status]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating maintenance request: " + error.message);
  }
};

// Function to update a maintenance request
const updateMaintenanceRequest = async (id, requestData) => {
  try {
    const { unitId, requestDescription, requestDate, status } = requestData;
    const result = await pool.query(
      "UPDATE MaintenanceRequests SET unit_id = $1, request_description = $2, request_date = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [unitId, requestDescription, requestDate, status, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating maintenance request: " + error.message);
  }
};

// Function to delete a maintenance request
const deleteMaintenanceRequest = async (id) => {
  try {
    await pool.query("DELETE FROM MaintenanceRequests WHERE id = $1", [id]);
    return { message: "Maintenance request deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting maintenance request: " + error.message);
  }
};

// Function to get all maintenance requests for a specific unit
const getRequestsByUnitId = async (unitId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM MaintenanceRequests WHERE unit_id = $1",
      [unitId]
    );
    return result.rows;
  } catch (error) {
    throw new Error(
      "Error retrieving maintenance requests by unit: " + error.message
    );
  }
};

// Export functions
module.exports = {
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  getRequestsByUnitId,
};
