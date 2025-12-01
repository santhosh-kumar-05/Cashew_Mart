const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const path = require("path");
const Razorpay = require("razorpay");

dotenv.config();
connectDB();

// IMPORTANT: serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
