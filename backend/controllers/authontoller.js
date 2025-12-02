const User = require("../models/userModel");

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already registered",
      });
    }

    // Create user with phone & address
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || null,
      address: address || null,
      avatar: avatar || null,
    });

    const token = user.getJwtToken();

    res.status(201).json({
      status: true,
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

// LOGIN USER (unchanged)
// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password");

    // If user not found
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "No account registered with this email",
      });
    }

    // If password incorrect
    const isPasswordCorrect = await user.isValidPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = user.getJwtToken();

    res.status(200).json({
      status: true,
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // get ID from URL
    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.status(200).json({ status: true, user });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
