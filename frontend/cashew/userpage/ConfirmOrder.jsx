import React, { useEffect, useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import UserNav from "../userauthpage/UserNav";
import { useNavigate, useParams } from "react-router-dom";
import "../public/ConfirmOrder.css";
import { useSelector } from "react-redux";
import axios from "axios";

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { shippingInfo } = useSelector((state) => state.Shiping);

  const [cartItems, setCartItems] = useState([]);
  const [userdata, setuserdata] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/product/${id}`);
        const data = res.data.products || res.data;

        const imagesArray = Array.isArray(data.images)
          ? data.images
          : data.image
          ? [data.image]
          : data.imagesList || [];

        const itemObj = {
          name: data.name,
          price: Number(data.price),
          quantity: 1,
          image: imagesArray[0] ? `http://localhost:5000${imagesArray[0]}` : "",
        };

        setCartItems([itemObj]);
      } catch (err) {
        console.error("Product fetch error:", err.message);
      }
    };

    fetchProduct();
  }, [id]);

  const updateQuantity = (index, type) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = subtotal > 5000 ? 0 : 150;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingPrice + tax;

  useEffect(() => {
    // Fetch Profile
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      fetch(`http://localhost:5000/api/auth/profile/${storedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) setuserdata(data.user);
        })
        .catch((err) => console.error("Profile error:", err));
    }
  }, []);

  console.log(userdata);

  const proceedToPayment = async (amount) => {
    // Store order data in localStorage
    localStorage.setItem(
      "orderInfo",
      JSON.stringify({
        cartItems,
        shippingInfo,
        subtotal,
        shippingPrice,
        tax,
        totalPrice,
        user: userdata,
      })
    );

    const { data: orderData } = await axios.post(
      "http://localhost:5000/payment/process",
      { amount }
    );

    const { data: keyData } = await axios.get("http://localhost:5000/getkey");

    const { key } = keyData;
    const { order } = orderData;

    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Cashewnut",
      description: "CashewNut E_commerce",
      order_id: order.id,

      handler: function (response) {
        // Save payment response also in localStorage
        localStorage.setItem(
          "paymentInfo",
          JSON.stringify({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          })
        );

        navigate(`/paymentsuccess?reference=${response.razorpay_payment_id}`, {
          replace: true,
        });
      },

      prefill: {
        name: userdata?.name,
        email: userdata?.email,
        contact: userdata?.phone,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <UserNav />
      <CheckoutSteps step1 step2 />

      <section className="confirmOrderPage">
        <div className="shippingBox">
          <h3>Shipping Information</h3>
          <div className="shippingDetail">
            <p>
              <strong>Address:</strong> {shippingInfo.address}
            </p>
            <p>
              <strong>City:</strong> {shippingInfo.city}
            </p>
            <p>
              <strong>State:</strong> {shippingInfo.state}
            </p>
            <p>
              <strong>Country:</strong> {shippingInfo.country?.label}
            </p>
            <p>
              <strong>Postal Code:</strong> {shippingInfo.postalCode}
            </p>
            <p>
              <strong>Phone:</strong> {shippingInfo.phone}
            </p>
          </div>

          <button
            className="backBtn"
            onClick={() => navigate(`/productdeatils/${id}`)}
          >
            ← Back to Cart
          </button>
        </div>

        <div className="cartAndSummary">
          <div className="cartItemsBox">
            <h3>Your Cart Items</h3>

            {cartItems.map((item, index) => (
              <div key={index} className="cartItemCard">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>

                <div className="quantityControl">
                  <button
                    className="qtyBtn"
                    onClick={() => updateQuantity(index, "dec")}
                  >
                    -
                  </button>
                  <span className="qtyNumber">{item.quantity}</span>
                  <button
                    className="qtyBtn"
                    onClick={() => updateQuantity(index, "inc")}
                  >
                    +
                  </button>
                </div>

                <span>
                  {item.quantity} x ₹{item.price} ={" "}
                  <strong>₹{item.price * item.quantity}</strong>
                </span>
              </div>
            ))}
          </div>

          <div className="summaryBox">
            <h3>Order Summary</h3>

            <div className="summaryDetails">
              <div>
                <span>Subtotal:</span>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <span>Shipping:</span>
                <span>₹{shippingPrice}</span>
              </div>
              <div>
                <span>Tax (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className="summaryTotal">
                <strong>Total:</strong>
                <strong>₹{totalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <button
              className="paymentBtn"
              onClick={() => proceedToPayment(totalPrice.toFixed(2))}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmOrder;
