const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      _id: { type: String },
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },

    cartItems: [
      {
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    shippingInfo: {
      address: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      phone: String,
    },

    subtotal: Number,
    shippingPrice: Number,
    tax: Number,
    totalPrice: Number,

    paymentInfo: {
      paymentId: String,
      orderId: String,
      signature: String,
    },

    status: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
