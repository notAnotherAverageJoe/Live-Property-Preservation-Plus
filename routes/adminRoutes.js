const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const restrictToAccessLevel = require("../middleware/accessLevel");
const {
  getAdminDashboard,
  getRestrictedData,
} = require("../controllers/adminController");

// Apply authentication middleware before access level restrictions
router.get(
  "/admin-dashboard",
  authenticate,
  restrictToAccessLevel(5),
  getAdminDashboard
);
router.get(
  "/restricted-data",
  authenticate,
  restrictToAccessLevel(3),
  getRestrictedData
);

module.exports = router;
