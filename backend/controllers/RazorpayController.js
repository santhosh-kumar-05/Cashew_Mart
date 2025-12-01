const instance = require("../utils/razorpay");
const crypto = require("crypto");


exports.processPayment = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("RAZORPAY ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getkey = async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
};
exports.paymentVerification = async (req, res) => {
  console.log(req.body);
  res.status(200).json({
    success:true
  })
};

exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.redirect(`http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};
