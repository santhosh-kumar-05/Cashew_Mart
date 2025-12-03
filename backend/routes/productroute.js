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

// CREATE PRODUCT
router.post("/product", upload.single("image"), createProduct);

// GET ALL PRODUCTS
router.get("/product", getAllProducts);

// GET SINGLE PRODUCT
router.get("/product/:id", getSingleProduct);

// UPDATE PRODUCT
router.put("/product/:id", upload.single("image"), updateProduct);

// DELETE PRODUCT
router.delete("/product/:id", deleteProduct);

module.exports = router;
