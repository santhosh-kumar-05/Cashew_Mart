const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productcontroller");

const router = express.Router();
const upload = require("../middlewares/multer");

// CREATE PRODUCT - support multiple images
router.post("/product", upload.array("images", 5), createProduct);

// GET ALL PRODUCTS
router.get("/product", getAllProducts);

// GET SINGLE PRODUCT
router.get("/product/:id", getSingleProduct);

// UPDATE PRODUCT - also support multiple images
router.put("/product/:id", upload.array("images", 5), updateProduct);

// DELETE PRODUCT
router.delete("/product/:id", deleteProduct);

module.exports = router;
