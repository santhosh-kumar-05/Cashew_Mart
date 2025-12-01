// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//       select: false, // don't return password by default
//     },

//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

//     avatar: {
//       type: String,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// // 🔹 Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next(); // only hash if password changed
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // 🔹 Generate JWT token
// userSchema.methods.getJwtToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_TIME  || '1h',
//   });
// };

// // 🔹 Compare password
// userSchema.methods.isValidPassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// 🔹 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Generate JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME || "1h",
  });
};

// 🔹 Compare password
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);

