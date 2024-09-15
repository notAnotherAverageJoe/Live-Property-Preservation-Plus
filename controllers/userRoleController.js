const userRoleModel = require("../models/userRoleModel");

const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;
  try {
    const userRole = await userRoleModel.assignRoleToUser(userId, roleId);
    res.status(201).json(userRole);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning role to user", error: error.message });
  }
};

const removeRoleFromUser = async (req, res) => {
  const { userId, roleId } = req.body;
  try {
    await userRoleModel.removeRoleFromUser(userId, roleId);
    res.json({ message: "Role removed from user successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing role from user", error: error.message });
  }
};

const getRolesByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const roles = await userRoleModel.getRolesByUserId(userId);
    res.json(roles);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving roles for user",
      error: error.message,
    });
  }
};

module.exports = {
  assignRoleToUser,
  removeRoleFromUser,
  getRolesByUserId,
};
