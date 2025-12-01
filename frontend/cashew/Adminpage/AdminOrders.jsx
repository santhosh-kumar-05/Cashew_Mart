import React, { useEffect, useState } from "react";
import axios from "axios";
import "../public/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/all");
        setOrders(res.data.orders);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <div className="admin-orders-wrapper">
      <div className="orders-header">
        <div>
          <h1 className="orders-title">Orders Dashboard</h1>
          <p className="orders-subtitle">
            Track and manage customer orders in real-time
          </p>
        </div>
      </div>

      {/* ================= TABLE =================  */}
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ordered At</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "25px" }}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((item, index) => (
                <tr key={index}>
                  <td>{item.user?.name}</td>
                  <td>{item._id}</td>
                  <td>₹{item.totalPrice}</td>
                  <td>
                    <span
                      className={`status-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openModal(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL / POPUP =================  */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <h2 className="modal-title">Order Details</h2>

            {/* SHIPPING */}
            <div className="section-box">
              <h3>Shipping Information</h3>
              <p>
                <strong>Address:</strong> {selectedOrder.shippingInfo.address}
              </p>
              <p>
                <strong>City:</strong> {selectedOrder.shippingInfo.city}
              </p>
              <p>
                <strong>State:</strong> {selectedOrder.shippingInfo.state}
              </p>
              <p>
                <strong>Country:</strong> {selectedOrder.shippingInfo.country}
              </p>
              <p>
                <strong>Pincode:</strong>{" "}
                {selectedOrder.shippingInfo.postalCode}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.shippingInfo.phone}
              </p>
            </div>

            {/* PAYMENT */}
            <div className="section-box">
              <h3>Payment Details</h3>
              <p>
                <strong>Payment ID:</strong>{" "}
                {selectedOrder.paymentInfo?.paymentId || "N/A"}
              </p>
              <p>
                <strong>Order ID:</strong>{" "}
                {selectedOrder.paymentInfo?.orderId || "N/A"}
              </p>
              <p>
                <strong>Signature:</strong>{" "}
                {selectedOrder.paymentInfo?.signature || "N/A"}
              </p>
            </div>

            {/* CART ITEMS */}
            <div className="section-box">
              <h3>Items Ordered</h3>
              {selectedOrder.cartItems.map((i, idx) => (
                <div className="item-row" key={idx}>
                  {console.log(i.image)}
                  <img
                    src={`${i.image}`}
                    alt=""
                  />

                  <div>
                    <p>
                      <strong>{i.name}</strong>
                    </p>
                    <p>Qty: {i.quantity}</p>
                    <p>Price: ₹{i.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
