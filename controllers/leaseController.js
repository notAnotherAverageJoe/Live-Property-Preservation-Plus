const leaseModel = require("../models/leaseModel");
const pool = require("../config/db");

// Controller to get all leases
const getAllLeases = async (req, res) => {
  try {
    const leases = await leaseModel.getAllLeases();
    res.json(leases);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving leases", error: error.message });
  }
};

// Controller to get a lease by ID
const getLeaseById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const lease = await leaseModel.getLeaseById(id);
    if (lease) {
      res.json(lease);
    } else {
      res.status(404).json({ message: "Lease not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving lease", error: error.message });
  }
};

// Controller to create a new lease
const createLease = async (req, res) => {
  try {
    const lease = await leaseModel.createLease(req.body);
    res.status(201).json(lease);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating lease", error: error.message });
  }
};

// Controller to update a lease

const updateLease = async (req, res) => {
  const { id } = req.params;
  const { unit_id, tenant_id, start_date, end_date, rent_amount, status } =
    req.body;

  // Validation
  if (
    !unit_id ||
    !tenant_id ||
    !start_date ||
    !end_date ||
    !rent_amount ||
    !status
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `
    UPDATE leases
    SET unit_id = $1,
        tenant_id = $2,
        start_date = $3,
        end_date = $4,
        rent_amount = $5,
        status = $6,
        updated_at = NOW()
    WHERE id = $7
    RETURNING *;
  `;
  const values = [
    unit_id,
    tenant_id,
    start_date,
    end_date,
    rent_amount,
    status,
    id,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lease not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating lease:", error);
    res.status(500).json({ message: "Error updating lease" });
  }
};

// Controller to delete a lease
const deleteLease = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await leaseModel.deleteLease(id);
    res.json({ message: "Lease deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lease", error: error.message });
  }
};

module.exports = {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  deleteLease,
};
