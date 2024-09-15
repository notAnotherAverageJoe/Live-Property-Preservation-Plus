const pool = require("../config/db");

// Function to get all companies
const getAllCompanies = async () => {
  try {
    const result = await pool.query("SELECT * FROM Companies");
    return result.rows;
  } catch (error) {
    throw new Error("Error retrieving companies: " + error.message);
  }
};

// Function to get a company by ID
const getCompanyById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM Companies WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving company: " + error.message);
  }
};

// Function to create a new company
const createCompany = async (companyData) => {
  try {
    const { name, address } = companyData;
    const result = await pool.query(
      "INSERT INTO Companies (name, address) VALUES ($1, $2) RETURNING *",
      [name, address]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating company: " + error.message);
  }
};

// Function to update a company
const updateCompany = async (id, companyData) => {
  try {
    const { name, address } = companyData;
    const result = await pool.query(
      "UPDATE Companies SET name = $1, address = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [name, address, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating company: " + error.message);
  }
};

// Function to delete a company
const deleteCompany = async (id) => {
  try {
    await pool.query("DELETE FROM Companies WHERE id = $1", [id]);
    return { message: "Company deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting company: " + error.message);
  }
};
// Method to update company_id for a user
const updateUserCompanyId = async (userId, companyId) => {
  const result = await db.query(
    "UPDATE Users SET company_id = $1 WHERE id = $2 RETURNING *",
    [companyId, userId]
  );
  return result.rows[0];
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  updateUserCompanyId,
};
