// controllers/adminController.js
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");

const SECRET_KEY = "your_secret_key";

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;
  const adminData = AdminModel.findAdmin(username);

  if (!adminData || password !== adminData.password) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign({ username, role: "admin" }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.status(200).json({ message: "Login Successful", token });
};

exports.getDashboard = (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
};
