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
      image: req.file ? req.file.filename : null, // store only filename
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
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

    const productsWithFullUrls = products.map((p) => ({
      ...p._doc,
      image: p.image ? getFullImageUrl(req, p.image) : null,
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

  const productWithFullUrl = {
    ...products._doc,
    image: products.image ? getFullImageUrl(req, products.image) : null,
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

    let updatedData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
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
