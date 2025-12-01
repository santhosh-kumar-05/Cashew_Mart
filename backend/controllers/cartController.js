// controllers/cartController.js
const Cart = require("../models/cartModel");

// 🔹 Add to cart
exports.addToCart = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug

    const { userId, productId, name, price, image } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }

    // Check if item already exists in cart
    let existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.quantity = existing.quantity ? existing.quantity + 1 : 1;
      await existing.save();
      return res.json({ message: "Quantity updated", cartItem: existing });
    }

    // Create new cart item
    const newItem = await Cart.create({
      userId,
      productId,
      name,
      price,
      image,
      quantity: 1,
    });

    res.json({ message: "Added to cart", cartItem: newItem });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get cart items for a user
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const cart = await Cart.find({ userId });
    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Delete cart item by cart item ID
exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Cart item ID is required" });
    }

    await Cart.findByIdAndDelete(id);
    res.json({ message: "Item removed" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Update quantity of cart item
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!id || quantity == null) {
      return res.status(400).json({ error: "Cart item ID and quantity are required" });
    }

    const cartItem = await Cart.findById(id);
    if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: "Quantity updated", cartItem });
  } catch (error) {
    console.error("Update cart item quantity error:", error);
    res.status(500).json({ error: error.message });
  }
};
