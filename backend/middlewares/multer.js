const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cashew_products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// Multer upload instance
const upload = multer({ storage });

module.exports = upload;
