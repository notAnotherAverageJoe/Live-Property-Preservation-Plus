const pool = require("../config/db");

// Create a new unit
exports.createUnit = async (req, res) => {
  const { property_id, unit_number, type, rent_amount } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO Units (property_id, unit_number, type, rent_amount) VALUES ($1, $2, $3, $4) RETURNING *",
      [property_id, unit_number, type, rent_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a unit
exports.updateUnit = async (req, res) => {
  const { id } = req.params;
  const { unit_number, type, rent_amount } = req.body;

  try {
    const result = await pool.query(
      "UPDATE Units SET unit_number = $1, type = $2, rent_amount = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
      [unit_number, type, rent_amount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a unit
exports.deleteUnit = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM Units WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Unit not found" });
    }

    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch units by property ID
exports.getUnitsByProperty = async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10); // Ensure propertyId is an integer

  if (isNaN(propertyId)) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM Units WHERE property_id = $1",
      [propertyId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No units found for this property" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
