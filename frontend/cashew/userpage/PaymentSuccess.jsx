import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../src/axiosConfig"; // centralized axios instance
import UserNav from "../userauthpage/UserNav";
import "../public/PaymentSuccess.css";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  const sentRequest = useRef(false); // prevent multiple order creations

  useEffect(() => {
    if (sentRequest.current) return;
    sentRequest.current = true;

    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => navigate("/allproducts", { replace: true });

    // Retrieve order and payment info from localStorage
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

      API.post("/create", payload)
        .then((res) => {
          console.log("Order stored successfully:", res.data);
          localStorage.removeItem("orderInfo");
          localStorage.removeItem("paymentInfo");
        })
        .catch((err) => console.error("Error saving order:", err.message));
    }
  }, [navigate]);

  return (
    <section className="payment-success-container">
      <UserNav />
      <div className="payment-card">
        <div className="success-icon">✓</div>
        <h2>Payment Successful 🎉</h2>
        <p className="ref-id">
          <strong>Reference ID:</strong> {reference || "N/A"}
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
