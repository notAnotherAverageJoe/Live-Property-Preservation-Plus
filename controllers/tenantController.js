const pool = require("../config/db");

// Get all tenants
exports.getAllTenants = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Tenants");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a tenant by ID
exports.getTenantById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM Tenants WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Tenant not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Create a new tenant
exports.createTenant = async (req, res) => {
  const { first_name, last_name, email, phone, property_id, company_id } =
    req.body;
  try {
    const result = await pool.query(
      "INSERT INTO Tenants (first_name, last_name, email, phone, property_id, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [first_name, last_name, email, phone, property_id, company_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update a tenant
exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone, property_id, company_id } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE Tenants SET first_name = $1, last_name = $2, email = $3, phone = $4, property_id = $5, company_id = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *",
      [first_name, last_name, email, phone, property_id, company_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Tenant not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete a tenant
exports.deleteTenant = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM Tenants WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ msg: "Tenant not found" });
    }
    res.json({ msg: "Tenant deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get tenants based on companyId and optional propertyId
exports.getTenants = async (req, res) => {
  const { companyId } = req.params;
  const { property_id } = req.query;

  let query = "SELECT * FROM Tenants WHERE company_id = $1";
  const queryParams = [companyId];

  if (property_id) {
    query += " AND property_id = $2";
    queryParams.push(property_id);
  }

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tenants:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
