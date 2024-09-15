const jwt = require("jsonwebtoken");
const companyModel = require("../models/companyModel");

const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving companies", error: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await companyModel.getCompanyById(req.params.id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving company", error: error.message });
  }
};

const createCompany = async (req, res) => {
  try {
    const newCompany = await companyModel.createCompany(req.body);
    // Link company to user
    await companyModel.updateUserCompanyId(req.user.id, newCompany.id);
    // Generate token with updated company_id
    const newToken = jwt.sign(
      { id: req.user.id, company_id: newCompany.id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(201).json({ companyId: newCompany.id, newToken });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating company", error: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { companyId } = req.body;
  const userId = req.user.id;

  try {
    // Update company ID for the user
    await companyModel.updateUserCompanyId(userId, companyId);
    // Generate a new token with updated companyId
    const newToken = jwt.sign(
      { id: userId, company_id: companyId },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ newToken });
  } catch (error) {
    console.error("Failed to update company", error);
    res.status(500).json({ error: "Failed to update company" });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const result = await companyModel.deleteCompany(req.params.id);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting company", error: error.message });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
