const product = require("../models/productmodel");
const Apifeatures = require("../utils/apifeauture");

exports.CreateProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const products = await product.create({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: req.file ? `/uploads/${req.file.filename}` : null,
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



exports.GetAllProduct = async (req, res, next) => {
  try {
    const api = new Apifeatures(product.find(), req.query).search().filter();
    const products = await api.query;

    res.status(200).json({
      success: true,
      count: products.length,
      products, // full product data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.singleproduct = async (req, res, next) => {
  const { id } = req.params;
  const products = await product.findById(id);
  if (!products) {
    res.status(404).json({
      success: false,
      messsage: "product not found",
    });
  }
  res.status(200).json({
    success: true,
    products,
  });
};

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
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    // Update the product
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
exports.dlelteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete in one step
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



