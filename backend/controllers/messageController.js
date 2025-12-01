const Message = require("../models/messageModel");

// Create and save message
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages: msgs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.messagedelete = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
