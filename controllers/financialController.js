const financialModel = require("../models/financialModel");
const pool = require("../config/db");

// Controller to get all financial transactions
const getAllFinancialTransactions = async (req, res) => {
  try {
    const transactions = await financialModel.getAllFinancialTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving financial transactions",
      error: error.message,
    });
  }
};

// Controller to get a financial transaction by ID
const getFinancialTransactionById = async (req, res) => {
  const transactionId = parseInt(req.params.id);

  try {
    const transaction = await financialModel.getFinancialTransactionById(
      transactionId
    );

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Financial transaction not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching financial transaction",
      error: error.message,
    });
  }
};

// Controller to create a new financial transaction
const createFinancialTransaction = async (req, res) => {
  try {
    const transaction = await financialModel.createFinancialTransaction(
      req.body
    );
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: "Error creating financial transaction",
      error: error.message,
    });
  }
};

// Controller to update a financial transaction
const updateFinancialTransaction = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const transaction = await financialModel.updateFinancialTransaction(
      id,
      req.body
    );
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Financial transaction not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating financial transaction",
      error: error.message,
    });
  }
};

// Controller to delete a financial transaction
const deleteFinancialTransaction = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await financialModel.deleteFinancialTransaction(id);
    res.json({ message: "Financial transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting financial transaction",
      error: error.message,
    });
  }
};

module.exports = {
  getAllFinancialTransactions,
  getFinancialTransactionById,
  createFinancialTransaction,
  updateFinancialTransaction,
  deleteFinancialTransaction,
};
