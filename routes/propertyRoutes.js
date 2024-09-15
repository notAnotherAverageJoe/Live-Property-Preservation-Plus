const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const authenticate = require("../middleware/authenticate");
const pool = require("../config/db");

// Route to create a new property
router.post("/properties", authenticate, propertyController.createProperty);

// Route to get all properties for the authenticated user's company
router.get("/properties", authenticate, propertyController.getProperties);

// Route to update a property
router.put("/properties/:id", authenticate, propertyController.updateProperty);

// Route to delete a property
router.delete(
  "/properties/:id",
  authenticate,
  propertyController.deleteProperty
);

// Route to get a specific property
router.get("/properties/:id", authenticate, async (req, res) => {
  const propertyId = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM Properties WHERE id = $1", [
      propertyId,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    console.error("Error fetching property details:", error);
    res.status(500).json({
      message: "Error fetching property details",
      error: error.message,
    });
  }
});

// Route to get all units for a specific property
router.get("/properties/:id/units", authenticate, async (req, res) => {
  const propertyId = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "SELECT * FROM Units WHERE property_id = $1",
      [propertyId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "Units not found for this property" });
    }
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({
      message: "Error fetching units",
      error: error.message,
    });
  }
});

// Route to get all financial transactions for a property
router.get(
  "/properties/:id/financial-transactions",
  authenticate,
  propertyController.getFinancialTransactions
);

// Route to create a new financial transaction for a property
router.post(
  "/properties/:id/financial-transactions",
  authenticate,
  propertyController.createFinancialTransaction
);

// Route to delete a financial transaction
router.delete(
  "/properties/:propertyId/financial-transactions/:transactionId",
  authenticate,
  async (req, res) => {
    const { propertyId, transactionId } = req.params;

    try {
      const result = await propertyController.deleteTransaction(
        propertyId,
        transactionId
      );

      if (result) {
        return res
          .status(200)
          .json({ message: "Transaction deleted successfully" });
      } else {
        return res.status(404).json({ error: "Transaction not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// Route to update a financial transaction
router.put(
  "/properties/:propertyId/financial-transactions/:transactionId",
  authenticate,
  propertyController.updateFinancialTransaction
);

module.exports = router;
