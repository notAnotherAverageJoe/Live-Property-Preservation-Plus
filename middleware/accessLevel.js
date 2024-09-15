const jwt = require("jsonwebtoken");
const restrictToAccessLevel = (requiredAccessLevel) => (req, res, next) => {
  const user = req.user; // Assuming user info is attached to the request by authentication middleware

  if (
    !user ||
    (user.access_level < requiredAccessLevel && user.access_level !== null)
  ) {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient access level" });
  }

  next();
};

module.exports = restrictToAccessLevel;
