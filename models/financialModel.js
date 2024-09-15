const pool = require("../config/db");

// Function to get all financial transactions
const getAllFinancialTransactions = async () => {
  try {
    const result = await pool.query("SELECT * FROM financialtransactions");
    return result.rows;
  } catch (error) {
    throw new Error(
      "Error retrieving financial transactions: " + error.message
    );
  }
};

// Function to get a financial transaction by ID
const getFinancialTransactionById = async (id) => {
  try {
    const result = await pool.query(
      "SELECT * FROM financialtransactions WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error retrieving financial transaction: " + error.message);
  }
};

// Function to create a new financial transaction
const createFinancialTransaction = async (transactionData) => {
  try {
    const { propertyId, type, amount, description, transactionDate } =
      transactionData;
    const result = await pool.query(
      "INSERT INTO financialtransactions (property_id, type, amount, description, transaction_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [propertyId, type, amount, description, transactionDate]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating financial transaction: " + error.message);
  }
};

// Function to update a financial transaction
const updateFinancialTransaction = async (id, transactionData) => {
  try {
    const { propertyId, type, amount, description, transactionDate } =
      transactionData;
    const result = await pool.query(
      "UPDATE financialtransactions SET property_id = $1, type = $2, amount = $3, description = $4, transaction_date = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      [propertyId, type, amount, description, transactionDate, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating financial transaction: " + error.message);
  }
};

// Function to delete a financial transaction
const deleteFinancialTransaction = async (id) => {
  try {
    await pool.query("DELETE FROM financialtransactions WHERE id = $1", [id]);
    return { message: "Financial transaction deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting financial transaction: " + error.message);
  }
};

// Export functions
module.exports = {
  getAllFinancialTransactions,
  getFinancialTransactionById,
  createFinancialTransaction,
  updateFinancialTransaction,
  deleteFinancialTransaction,
};
