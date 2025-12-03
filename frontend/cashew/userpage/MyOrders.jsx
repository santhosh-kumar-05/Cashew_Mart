import React, { useEffect, useState } from "react";
import API from "../src/axiosConfig"; // use the configured axios instance
import UserNav from "../userauthpage/UserNav";
import "../public/MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get(`/user/${userId}`); // use API instance
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrders();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <>
        <UserNav />
        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>You haven’t placed any orders yet. Start shopping now!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNav />
      <section className="my-orders-container">
        <h2 className="page-title">My Orders</h2>

        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
            {console.log(order)
            }  
              <div className="order-header">
                <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-products">
                {order.cartItems.map((item, idx) => (
                  <div key={idx} className="product-card">
                    <img
                      src={item.image} // direct path from backend
                      alt={item.name}
                      className="product-img"
                    />
                    <div className="product-info">
                      <p className="product-name">{item.name}</p>
                      <p className="product-qty">
                        {item.quantity} × ₹{item.price} ={" "}
                        <strong>₹{item.quantity * item.price}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <p>
                  <span>Subtotal</span> <span>₹{order.subtotal.toFixed(2)}</span>
                </p>
                <p>
                  <span>Shipping</span> <span>₹{order.shippingPrice.toFixed(2)}</span>
                </p>
                <p>
                  <span>Tax</span> <span>₹{order.tax.toFixed(2)}</span>
                </p>
                <p className="order-total">
                  <span>Total</span> <span>₹{order.totalPrice.toFixed(2)}</span>
                </p>
              </div>

              <div className="order-actions">
                {/* Add action buttons here if needed */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default MyOrders;
