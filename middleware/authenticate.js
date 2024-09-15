// authenticate.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Token:", token);
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ error: "Failed to authenticate token" });

    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  });
};
