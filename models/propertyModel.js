const pool = require("../config/db");

// Function to get all properties
const getAllProperties = async () => {
  try {
    const result = await pool.query("SELECT * FROM Properties");
    return result.rows;
  } catch (error) {
    throw new Error("Error retrieving properties: " + error.message);
  }
};

// Function to get a property by ID
const getPropertyById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Properties WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving property: " + error.message);
  }
};

// Function to create a new property
const createProperty = async (propertyData) => {
  try {
    const { companyId, name, address } = propertyData;
    const result = await pool.query(
      "INSERT INTO Properties (company_id, name, address) VALUES ($1, $2, $3) RETURNING *",
      [companyId, name, address]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating property: " + error.message);
  }
};

// Function to update a property
const updateProperty = async (id, propertyData) => {
  try {
    const { companyId, name, address } = propertyData;
    const result = await pool.query(
      "UPDATE Properties SET company_id = $1, name = $2, address = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [companyId, name, address, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating property: " + error.message);
  }
};

// Function to delete a property
const deleteProperty = async (id) => {
  try {
    await pool.query("DELETE FROM Properties WHERE id = $1", [id]);
    return { message: "Property deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting property: " + error.message);
  }
};

// Export functions
module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
