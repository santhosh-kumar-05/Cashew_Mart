import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import UserNav from "../userauthpage/UserNav";
import "../public/PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  const sentRequest = useRef(false); // <-- prevents multiple requests

  useEffect(() => {
    if (sentRequest.current) return; // <-- already sent
    sentRequest.current = true;       // <-- mark as sent

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      navigate("/allproducts", { replace: true });
    };

    const orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
    const paymentInfo = JSON.parse(localStorage.getItem("paymentInfo"));

    if (orderInfo && paymentInfo) {
      const payload = {
        user: orderInfo.user,
        cartItems: orderInfo.cartItems,
        shippingInfo: orderInfo.shippingInfo,
        subtotal: orderInfo.subtotal,
        shippingPrice: orderInfo.shippingPrice,
        tax: orderInfo.tax,
        totalPrice: orderInfo.totalPrice,
        paymentInfo: {
          paymentId: paymentInfo.paymentId,
          orderId: paymentInfo.orderId,
          signature: paymentInfo.signature,
        },
        status: "Paid",
      };

      axios
        .post("http://localhost:5000/create", payload)
        .then((res) => {
          console.log("Order stored once:", res.data);
          localStorage.removeItem("orderInfo");
          localStorage.removeItem("paymentInfo");
        })
        .catch((err) => console.error("Error saving order:", err));
    }
  }, [navigate]);

  return (
    <section className="payment-success-container">
      <UserNav />
      <div className="payment-card">
        <div className="success-icon">✓</div>
        <h2>Payment Successful 🎉</h2>
        <p className="ref-id">
          <strong>Reference ID:</strong> {reference}
        </p>
        <button
          className="back-btn"
          onClick={() => navigate("/allproducts", { replace: true })}
        >
          Continue Shopping
        </button>
      </div>
    </section>
  );
};

export default PaymentSuccess;
