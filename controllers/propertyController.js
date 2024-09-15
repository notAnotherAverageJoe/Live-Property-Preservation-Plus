const db = require("../config/db");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db"); // Adjust path as necessary

// Helper function to get user's company ID
const getCompanyIdForUser = async (userId) => {
  try {
    const result = await db.query(
      "SELECT company_id FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length > 0) {
      return result.rows[0].company_id;
    } else {
      throw new Error("Company ID not found for user");
    }
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
};

// Middleware to validate property creation and update
const validateProperty = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Property name is required"),
  body("address")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Property address is required"),
];

// Create a new property
exports.createProperty = [
  validateProperty,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    try {
      const companyId = await getCompanyIdForUser(userId);
      const { name, address } = req.body;

      const result = await db.query(
        "INSERT INTO properties (name, address, company_id) VALUES ($1, $2, $3) RETURNING *",
        [name, address, companyId]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Failed to create property: ${error.message}` });
    }
  },
];

// Get all properties for the authenticated user's company
exports.getProperties = async (req, res) => {
  const userId = req.user.id;
  try {
    const companyId = await getCompanyIdForUser(userId);
    const result = await db.query(
      "SELECT * FROM properties WHERE company_id = $1",
      [companyId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch properties: ${error.message}` });
  }
};

// Update a property
exports.updateProperty = [
  validateProperty,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { id } = req.params;
    const { name, address } = req.body;

    try {
      const companyId = await getCompanyIdForUser(userId);
      const result = await db.query(
        "UPDATE properties SET name = $1, address = $2 WHERE id = $3 AND company_id = $4 RETURNING *",
        [name, address, id, companyId]
      );
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res
          .status(404)
          .json({ error: "Property not found or does not belong to company" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: `Failed to update property: ${error.message}` });
    }
  },
];

// Delete a property
exports.deleteProperty = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const companyId = await getCompanyIdForUser(userId);
    const result = await db.query(
      "DELETE FROM properties WHERE id = $1 AND company_id = $2 RETURNING *",
      [id, companyId]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ message: "Property deleted" });
    } else {
      res
        .status(404)
        .json({ error: "Property not found or does not belong to company" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete property: ${error.message}` });
  }
};

// Function to get financial transactions for a specific property
exports.getFinancialTransactions = async (req, res) => {
  const propertyId = parseInt(req.params.id);

  if (isNaN(propertyId)) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM financialtransactions WHERE property_id = $1",
      [propertyId]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res
        .status(404)
        .json({ message: "No transactions found for this property" });
    }
  } catch (error) {
    console.error("Error fetching financial transactions:", error);
    res.status(500).json({
      message: "Error fetching financial transactions",
      error: error.message,
    });
  }
};

// Function to create a new financial transaction
exports.createFinancialTransaction = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { type, amount, description, transactionDate } = req.body;

    const newTransaction = await pool.query(
      `INSERT INTO financialtransactions 
       (property_id, type, amount, description, transaction_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [propertyId, type, amount, description, transactionDate]
    );

    res.status(201).json(newTransaction.rows[0]);
  } catch (error) {
    console.error("Error creating financial transaction:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to delete a financial transaction
exports.deleteTransaction = async (propertyId, transactionId) => {
  try {
    const result = await pool.query(
      "DELETE FROM FinancialTransactions WHERE property_id = $1 AND id = $2 RETURNING *",
      [propertyId, transactionId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

exports.updateFinancialTransaction = async (req, res) => {
  const { propertyId, transactionId } = req.params;
  const { type, amount, description, transactionDate } = req.body;

  try {
    const result = await pool.query(
      "UPDATE FinancialTransactions SET type = $1, amount = $2, description = $3, transaction_date = $4 WHERE id = $5 AND property_id = $6 RETURNING *",
      [type, amount, description, transactionDate, transactionId, propertyId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Failed to update transaction" });
  }
};
