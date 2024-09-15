const pool = require("../config/db");

// Get dashboard data for admins
const getAdminDashboard = async (req, res) => {
  try {
    // Perform action that requires high access level
    res.json({ message: "Admin dashboard data" });
  } catch (error) {
    res.status(500).json({
      message: "Error getting admin dashboard data",
      error: error.message,
    });
  }
};

// Get restricted data for users with medium access
const getRestrictedData = async (req, res) => {
  try {
    // Perform action that requires medium access level
    res.json({ message: "Restricted data" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting restricted data", error: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getRestrictedData,
};
