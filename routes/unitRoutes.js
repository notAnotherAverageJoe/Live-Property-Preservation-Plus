const express = require("express");
const router = express.Router();
const unitController = require("../controllers/unitController");
const authenticate = require("../middleware/authenticate");

// Route to fetch units for a specific property
router.get(
  "/properties/:propertyId/units",
  authenticate,
  unitController.getUnitsByProperty
);
router.post(
  "/properties/:propertyId/units",
  authenticate,
  unitController.createUnit
);

// Route to create a new unit
router.post("/units", authenticate, unitController.createUnit);

// Route to update a unit
router.put("/units/:id", authenticate, unitController.updateUnit);

// Route to delete a unit
router.delete("/units/:id", authenticate, unitController.deleteUnit);
// routes/units.js
router.get("/api/units", async (req, res) => {
  try {
    const units = await pool.query("SELECT * FROM Units");
    res.json(units.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
