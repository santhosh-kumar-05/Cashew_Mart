const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { user, cartItems, shippingInfo, subtotal, shippingPrice, tax, totalPrice, paymentInfo } = req.body;

    // Validate required fields
    if (!user || !user._id || !user.name || !user.email) {
      return res.status(400).json({ success: false, message: "User information is incomplete" });
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }

    if (!shippingInfo || !shippingInfo.address || !shippingInfo.city) {
      return res.status(400).json({ success: false, message: "Shipping information is incomplete" });
    }

    if (!subtotal || !totalPrice) {
      return res.status(400).json({ success: false, message: "Order prices are missing" });
    }

    if (!paymentInfo || !paymentInfo.paymentId || !paymentInfo.orderId || !paymentInfo.signature) {
      return res.status(400).json({ success: false, message: "Payment information is incomplete" });
    }

    // Create order
    const order = await Order.create(req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error); // Log full error for debugging
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// GET ORDERS BY USER ID
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ "user._id": req.params.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
