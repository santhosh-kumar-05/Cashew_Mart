const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  deleteCartItem,
  updateCartItemQuantity,
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.delete("/:id", deleteCartItem);
router.put("/:id", updateCartItemQuantity);

module.exports = router;
