const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }], // Array of Cloudinary URLs
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        name: { type: String, required: true },
        rating: { type: String, required: true },
        comment: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
