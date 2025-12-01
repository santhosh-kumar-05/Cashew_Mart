const express = require("express");
const { processPayment, getkey, paymentVerification } = require("../controllers/RazorpayController");
const router = express.Router();

router.route("/payment/process").post(processPayment);
router.route("/getkey").get(getkey);
router.route("/paymentverification").post(paymentVerification);


module.exports = router;
