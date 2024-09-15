const express = require("express");
const router = express.Router();
const leaseController = require("../controllers/leaseController");
const pool = require("../config/db");

// Fetch leases with optional filtering by tenant_id or company_id
router.get("/leases", async (req, res) => {
  try {
    const { tenant_id, company_id } = req.query;

    if (!company_id) {
      return res.status(400).json({ message: "Company ID is required." });
    }

    let query = "SELECT * FROM leases WHERE company_id = $1";
    const queryParams = [company_id];

    if (tenant_id) {
      query += " AND tenant_id = $2";
      queryParams.push(tenant_id);
    }

    const { rows: leases } = await pool.query(query, queryParams);

    if (leases.length === 0) {
      return res
        .status(404)
        .json({ message: "No leases found for this company/tenant." });
    }

    res.json(leases);
  } catch (error) {
    console.error("Error fetching leases:", error);
    res.status(500).json({ message: "Error fetching leases" });
  }
});

// Get a lease by ID
router.get("/leases/:id", leaseController.getLeaseById);

// Create a new lease
router.post("/leases", async (req, res) => {
  try {
    const {
      unit_id,
      tenant_id,
      start_date,
      end_date,
      rent_amount,
      company_id,
    } = req.body;

    // Validation
    if (
      !unit_id ||
      !tenant_id ||
      !start_date ||
      !end_date ||
      !rent_amount ||
      !company_id
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const query = `
      INSERT INTO leases (unit_id, tenant_id, start_date, end_date, rent_amount, company_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [
      unit_id,
      tenant_id,
      start_date,
      end_date,
      rent_amount,
      company_id,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating lease:", error);
    res.status(500).json({ message: "Error creating lease" });
  }
});

// Update a lease by ID
router.put("/leases/:id", leaseController.updateLease);

// Delete a lease by ID
router.delete("/leases/:id", leaseController.deleteLease);
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env; // Make sure to set this in your environment

const verifyTokenAndCompanyId = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

  if (!token) return res.status(401).send("Access denied.");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const tokenCompanyId = decoded.company_id;
    const requestCompanyId = parseInt(req.query.company_id); // Or where the company_id comes from in your request

    if (tokenCompanyId !== requestCompanyId) {
      return res.status(403).send("Forbidden: Company ID mismatch.");
    }

    // Token is valid and company IDs match
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token.");
  }
};

// Example route using the middleware
router.get("/api/leases", verifyTokenAndCompanyId, async (req, res) => {
  // Fetch leases based on tenant_id and company_id
  const { tenant_id, company_id } = req.query;

  try {
    // Your logic to fetch leases based on tenant_id and company_id
    // Make sure to check the company_id from the token here as well
    const leases = await getLeases(tenant_id, company_id);
    res.json(leases);
  } catch (error) {
    res.status(500).send("Error fetching leases.");
  }
});

module.exports = router;
