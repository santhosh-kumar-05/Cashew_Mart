const express = require("express");
const router = express.Router();
const { sendMessage, getAllMessages, messagedelete } = require("../controllers/messageController");

// User routes
router.post("/contact", sendMessage);

// Admin routes
router.get("/messages", getAllMessages);
router.delete("/messages/:id",messagedelete)

module.exports = router;
