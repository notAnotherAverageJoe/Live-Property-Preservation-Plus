const pool = require("../config/db");

// Function to get all tenants
const getAllTenants = async () => {
  try {
    const result = await pool.query("SELECT * FROM Tenants");
    return result.rows;
  } catch (error) {
    throw new Error("Error retrieving tenants: " + error.message);
  }
};

// Function to get a tenant by ID
const getTenantById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Tenants WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving tenant: " + error.message);
  }
};

// Function to create a new tenant
const createTenant = async (tenantData) => {
  try {
    const { firstName, lastName, email, phone } = tenantData;
    const result = await pool.query(
      "INSERT INTO Tenants (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstName, lastName, email, phone]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating tenant: " + error.message);
  }
};

// Function to update a tenant
const updateTenant = async (id, tenantData) => {
  try {
    const { firstName, lastName, email, phone } = tenantData;
    const result = await pool.query(
      "UPDATE Tenants SET first_name = $1, last_name = $2, email = $3, phone = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [firstName, lastName, email, phone, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating tenant: " + error.message);
  }
};

// Function to delete a tenant
const deleteTenant = async (id) => {
  try {
    await pool.query("DELETE FROM Tenants WHERE id = $1", [id]);
    return { message: "Tenant deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting tenant: " + error.message);
  }
};

// Export functions
module.exports = {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
};
