const express = require("express");
const router = express.Router();
const userRoleController = require("../controllers/userRoleController");
const authenticate = require("../middleware/authenticate");

// Route to assign a role to a user
router.post("/user-roles", authenticate, userRoleController.assignRoleToUser);

// Route to remove a role from a user
router.delete(
  "/user-roles",
  authenticate,
  userRoleController.removeRoleFromUser
);

// Route to get roles for a user by userId
router.get(
  "/user-roles/:userId",
  authenticate,
  userRoleController.getRolesByUserId
);

module.exports = router;
