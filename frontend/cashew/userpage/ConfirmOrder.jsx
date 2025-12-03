import React, { useEffect, useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import UserNav from "../userauthpage/UserNav";
import { useNavigate, useParams } from "react-router-dom";
import "../public/ConfirmOrder.css";
import { useSelector } from "react-redux";
import API from "../src/axiosConfig";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { shippingInfo } = useSelector((state) => state.Shiping);

  const [cartItems, setCartItems] = useState([]);
  const [userdata, setUserdata] = useState({});
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH PRODUCT DETAILS
  // ==============================
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/product/${id}`);
        const product = res.data.product || res.data;

        const image = Array.isArray(product.images)
          ? product.images[0]
          : product.image || "";

        setCartItems([
          {
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            image,
          },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Product fetch error:", err);
        setLoading(false);
      }
    })();
  }, [id]);

  // ==============================
  // FETCH USER PROFILE
  // ==============================
  useEffect(() => {
    (async () => {
      try {
        const uid = localStorage.getItem("userId");
        if (!uid) return;

        const res = await API.get(`/auth/profile/${uid}`);
        if (res.data.status) setUserdata(res.data.user);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    })();
  }, []);

  // ==============================
  // UPDATE QUANTITY
  // ==============================
  const updateQuantity = (index, type) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  // ==============================
  // CART PRICE CALCULATIONS
  // ==============================
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 5000 ? 0 : 150;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingPrice + tax;

  // ==============================
  // PAYMENT HANDLER
  // ==============================
  const proceedToPayment = async () => {
    localStorage.setItem(
      "orderInfo",
      JSON.stringify({ cartItems, shippingInfo, subtotal, shippingPrice, tax, totalPrice, user: userdata })
    );

    try {
      const { data: orderData } = await API.post("/payment/process", { amount: totalPrice });
      const { data: keyData } = await API.get("/getkey");

      const options = {
        key: keyData.key,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Cashewnut",
        description: "Payment Checkout",
        order_id: orderData.order.id,
        handler: (response) => {
          localStorage.setItem(
            "paymentInfo",
            JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            })
          );
          navigate(`/paymentsuccess?reference=${response.razorpay_payment_id}`, { replace: true });
        },
        prefill: {
          name: userdata?.name,
          email: userdata?.email,
          contact: userdata?.phone,
        },
        theme: { color: "#F37254" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading product...</p>;

  return (
    <>
      <UserNav />
      <CheckoutSteps step1 step2 />

      <section className="confirmOrderPage">
        <div className="shippingBox">
          <h3>Shipping Information</h3>
          <div className="shippingDetail">
            <p><strong>Address:</strong> {shippingInfo.address}</p>
            <p><strong>City:</strong> {shippingInfo.city}</p>
            <p><strong>State:</strong> {shippingInfo.state}</p>
            <p><strong>Country:</strong> {shippingInfo.country?.label || shippingInfo.country}</p>
            <p><strong>Postal Code:</strong> {shippingInfo.postalCode}</p>
            <p><strong>Phone:</strong> {shippingInfo.phone}</p>
          </div>

          <button className="backBtn" onClick={() => navigate(`/productdetails/${id}`)}>
            ← Back to Product
          </button>
        </div>

        <div className="cartAndSummary">
          <div className="cartItemsBox">
            <h3>Your Cart Items</h3>

            {cartItems.map((item, index) => (
              
              <div key={index} className="cartItemCard">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                {console.log(item)
                }

                <div className="quantityControl">
                  <button className="qtyBtn" onClick={() => updateQuantity(index, "dec")}>-</button>
                  <span className="qtyNumber">{item.quantity}</span>
                  <button className="qtyBtn" onClick={() => updateQuantity(index, "inc")}>+</button>
                </div>

                <span>
                  {item.quantity} x ₹{item.price} = <strong>₹{item.price * item.quantity}</strong>
                </span>
              </div>
            ))}
          </div>

          <div className="summaryBox">
            <h3>Order Summary</h3>
            <div className="summaryDetails">
              <div><span>Subtotal:</span><span>₹{subtotal}</span></div>
              <div><span>Shipping:</span><span>₹{shippingPrice}</span></div>
              <div><span>Tax (18%):</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="summaryTotal">
                <strong>Total:</strong>
                <strong>₹{totalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <button className="paymentBtn" onClick={proceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmOrder;
