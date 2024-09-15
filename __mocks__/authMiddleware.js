// __mocks__/authMiddleware.js
module.exports = (req, res, next) => {
  req.user = { id: 1, email: "test@example.com" }; // Mock user object
  next();
};
