const express = require("express");
const {
  CreateProduct,
  GetAllProduct,
  singleproduct,
  updateProduct,
  dlelteProduct,
} = require("../controllers/productcontroller");

const router = express.Router();
const upload = require("../middlewares/multer");

// CREATE PRODUCT (with image)
router.post("/product", upload.single("image"), CreateProduct);

// GET ALL PRODUCTS
router.get("/product", GetAllProduct);

// GET SINGLE PRODUCT
router.get("/product/:id", singleproduct);

// UPDATE PRODUCT (with optional image)
router.put("/product/:id", upload.single("image"), updateProduct);

// DELETE PRODUCT
router.delete("/product/:id", dlelteProduct);

module.exports = router;
