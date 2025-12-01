const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // should match the one in adminController.js

exports.verifyToken = (req, res, next) => {
  // Get the token from Authorization header: "Bearer <token>"
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // attach decoded user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
