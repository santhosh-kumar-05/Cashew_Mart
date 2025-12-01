const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrdersByUser,
} = require("../controllers/orderController.js");

const router = express.Router();

router.post("/create", createOrder);
router.get("/all", getAllOrders);
router.get("/user/:id", getOrdersByUser);

module.exports = router;
