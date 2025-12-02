const product = require("../models/productmodel");
const Apifeatures = require("../utils/apifeauture");

// Helper to build full image URL
const getFullImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// CREATE PRODUCT
exports.CreateProduct = async (req, res) => {
  try {
    const products = await product.create({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: req.file ? getFullImageUrl(req, req.file.filename) : null,
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error("ERROR IN PRODUCT CREATE:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PRODUCTS
exports.GetAllProduct = async (req, res, next) => {
  try {
    const api = new Apifeatures(product.find(), req.query).search().filter();
    const products = await api.query;

    // Ensure all image paths are full URLs
    const productsWithFullUrls = products.map((p) => ({
      ...p._doc,
      image: p.image?.startsWith("http") ? p.image : `${req.protocol}://${req.get("host")}${p.image}`,
    }));

    res.status(200).json({
      success: true,
      count: productsWithFullUrls.length,
      products: productsWithFullUrls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
exports.singleproduct = async (req, res, next) => {
  const { id } = req.params;
  const products = await product.findById(id);

  if (!products) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Ensure full URL
  const productWithFullUrl = {
    ...products._doc,
    image: products.image?.startsWith("http")
      ? products.image
      : `${req.protocol}://${req.get("host")}${products.image}`,
  };

  res.status(200).json({
    success: true,
    products: productWithFullUrl,
  });
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let products = await product.findById(id);
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Collect updated fields
    let updatedData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
    };

    // If new image uploaded
    if (req.file) {
      updatedData.image = getFullImageUrl(req, req.file.filename);
    }

    const updatedProduct = await product.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

// DELETE PRODUCT
exports.dlelteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
