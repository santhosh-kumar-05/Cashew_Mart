const Product = require("../models/productmodel");
const Apifeatures = require("../utils/apifeauture");
const cloudinary = require("../config/cloudinary");

// =========================
// CREATE PRODUCT
// =========================
exports.createProduct = async (req, res) => {
  try {
    // Support multiple images or single image
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    } else if (req.file) {
      images = [req.file.path];
    }

    const newProduct = await Product.create({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      images: images, // array of Cloudinary URLs
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("ERROR IN PRODUCT CREATE:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// GET ALL PRODUCTS
// =========================
exports.getAllProducts = async (req, res) => {
  try {
    const api = new Apifeatures(Product.find(), req.query).search().filter();
    const products = await api.query;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// GET SINGLE PRODUCT
// =========================
exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productData = await Product.findById(id);
    if (!productData) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: productData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
// UPDATE PRODUCT
// =========================
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productToUpdate = await Product.findById(id);
    if (!productToUpdate) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updatedData = {
      name: req.body.name || productToUpdate.name,
      category: req.body.category || productToUpdate.category,
      description: req.body.description || productToUpdate.description,
      price: req.body.price || productToUpdate.price,
      stock: req.body.stock || productToUpdate.stock,
    };

    // Handle new images
    if ((req.files && req.files.length > 0) || req.file) {
      // Delete old images from Cloudinary
      if (productToUpdate.images && productToUpdate.images.length > 0) {
        for (let imgUrl of productToUpdate.images) {
          const segments = imgUrl.split("/");
          const publicId = segments[segments.length - 1].split(".")[0];
          await cloudinary.uploader.destroy(`cashew_products/${publicId}`);
        }
      }

      // Set new images
      if (req.files && req.files.length > 0) {
        updatedData.images = req.files.map((file) => file.path);
      } else if (req.file) {
        updatedData.images = [req.file.path];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// =========================
// DELETE PRODUCT
// =========================
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (deletedProduct.images && deletedProduct.images.length > 0) {
      for (let imgUrl of deletedProduct.images) {
        const segments = imgUrl.split("/");
        const publicId = segments[segments.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(`cashew_products/${publicId}`);
      }
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};
