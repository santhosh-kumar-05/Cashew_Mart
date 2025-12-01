import React from "react";
import "../public/CheckoutSteps.css";
import UserNav from "../userauthpage/UserNav";

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <section>
      <UserNav />

      <div className="checkout-container " style={{ marginTop: "25px" }}>
        <div className={`step ${step1 ? "active" : ""}`}>
          <span>1</span>
          <p>Shipping</p>
        </div>

        <div className="line"></div>

        <div className={`step ${step2 ? "active" : ""}`}>
          <span>2</span>
          <p>Confirm Order</p>
        </div>

        <div className="line"></div>

        <div className={`step ${step3 ? "active" : ""}`}>
          <span>3</span>
          <p>Payment</p>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSteps;
