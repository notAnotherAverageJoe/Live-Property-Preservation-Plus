const pool = require("../config/db");

// Function to get all leases
const getAllLeases = async () => {
  try {
    const result = await pool.query("SELECT * FROM Leases");
    return result.rows;
  } catch (error) {
    throw new Error("Error retrieving leases: " + error.message);
  }
};

// Function to get a lease by ID
const getLeaseById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Leases WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving lease: " + error.message);
  }
};

// Function to create a new lease
const createLease = async (leaseData) => {
  try {
    const { unitId, tenantId, startDate, endDate, rentAmount, status } =
      leaseData;
    const result = await pool.query(
      "INSERT INTO Leases (unit_id, tenant_id, start_date, end_date, rent_amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [unitId, tenantId, startDate, endDate, rentAmount, status]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating lease: " + error.message);
  }
};

// Function to update a lease
const updateLease = async (id, leaseData) => {
  try {
    const { unitId, tenantId, startDate, endDate, rentAmount, status } =
      leaseData;
    const result = await pool.query(
      "UPDATE Leases SET unit_id = $1, tenant_id = $2, start_date = $3, end_date = $4, rent_amount = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
      [unitId, tenantId, startDate, endDate, rentAmount, status, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating lease: " + error.message);
  }
};

// Function to delete a lease
const deleteLease = async (id) => {
  try {
    await pool.query("DELETE FROM Leases WHERE id = $1", [id]);
    return { message: "Lease deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting lease: " + error.message);
  }
};

// Export functions
module.exports = {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  deleteLease,
};
