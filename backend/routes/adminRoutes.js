const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Login route (no token required)
router.post("/login", adminController.adminLogin);

// Example protected route (token required)
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

module.exports = router;
