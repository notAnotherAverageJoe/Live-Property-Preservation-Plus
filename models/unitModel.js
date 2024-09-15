const pool = require("../config/db");

// Function to get all units
const getAllUnits = async () => {
  try {
    const result = await pool.query("SELECT * FROM Units");
    return result.rows;
  } catch (error) {
    throw new Error("Error retrieving units: " + error.message);
  }
};

// Function to get a unit by ID
const getUnitById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Units WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving unit: " + error.message);
  }
};

// Function to create a new unit
const createUnit = async (unitData) => {
  try {
    const { propertyId, unitNumber, type, rentAmount } = unitData;
    const result = await pool.query(
      "INSERT INTO Units (property_id, unit_number, type, rent_amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [propertyId, unitNumber, type, rentAmount]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating unit: " + error.message);
  }
};

// Function to update a unit
const updateUnit = async (id, unitData) => {
  try {
    const { propertyId, unitNumber, type, rentAmount } = unitData;
    const result = await pool.query(
      "UPDATE Units SET property_id = $1, unit_number = $2, type = $3, rent_amount = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [propertyId, unitNumber, type, rentAmount, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating unit: " + error.message);
  }
};

// Function to delete a unit
const deleteUnit = async (id) => {
  try {
    await pool.query("DELETE FROM Units WHERE id = $1", [id]);
    return { message: "Unit deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting unit: " + error.message);
  }
};

// Export functions
module.exports = {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};
