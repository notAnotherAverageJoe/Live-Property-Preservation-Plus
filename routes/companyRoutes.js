//    routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const db = require("../config/db");
const authenticate = require("../middleware/authenticate"); // Middleware to handle authentication

// Route to create a new company
router.post("/companies", authenticate, async (req, res) => {
  const { name, address } = req.body;
  const userId = req.user.id; // Extract user ID from authenticated request

  try {
    // Create the company
    const newCompany = await db.query(
      `INSERT INTO Companies (name, address) VALUES ($1, $2) RETURNING id`,
      [name, address]
    );

    const companyId = newCompany.rows[0].id;

    // Link company to the user
    await db.query(`UPDATE Users SET company_id = $1 WHERE id = $2`, [
      companyId,
      userId,
    ]);

    res.status(201).json({ companyId });
  } catch (error) {
    console.error("Failed to create company", error);
    res.status(500).json({ error: "Failed to create company" });
  }
});

router.get("/user/company", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's company_id
    const user = await db.query("SELECT company_id FROM Users WHERE id = $1", [
      userId,
    ]);

    if (!user.rows[0].company_id) {
      return res
        .status(404)
        .json({ error: "User does not belong to any company" });
    }

    // Get company details
    const company = await db.query("SELECT * FROM Companies WHERE id = $1", [
      user.rows[0].company_id,
    ]);

    res.json(company.rows[0]);
  } catch (error) {
    console.error("Failed to fetch company data", error);
    res.status(500).json({ error: "Failed to fetch company data" });
  }
});

// Route to update an existing company
router.put("/companies/:id", authenticate, companyController.updateCompany);

// Route to get all companies
router.get("/companies", companyController.getAllCompanies);

// Route to get a specific company by ID
router.get("/companies/:id", companyController.getCompanyById);

// Route to delete a company
router.delete("/companies/:id", authenticate, companyController.deleteCompany);

module.exports = router;
