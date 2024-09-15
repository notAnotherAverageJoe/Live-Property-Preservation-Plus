const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  creatorloginUser,
} = require("../controllers/authController");

// POST /api/auth/register
router.post("/register", registerUser);
// POST /api/auth/login
router.post("/login", loginUser);
// POST Creator login
router.post("/creator-login", creatorloginUser);

module.exports = router;
