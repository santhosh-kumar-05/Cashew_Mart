import React, { useEffect, useState } from "react";
import API from "../src/axiosConfig";
import "../public/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/all");  // FIXED: Correct route
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
        <h1 className="orders-title">Orders Dashboard</h1>
        <p className="orders-subtitle">Track and manage customer orders in real-time</p>
      </div>

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
                <td colSpan="6" style={{ textAlign: "center", padding: "25px" }}>
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
                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="view-btn" onClick={() => openModal(item)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <h2 className="modal-title">Order Details</h2>

            <div className="section-box">
              <h3>Shipping Info</h3>
              <p><strong>Address:</strong> {selectedOrder.shippingInfo.address}</p>
              <p><strong>City:</strong> {selectedOrder.shippingInfo.city}</p>
              <p><strong>State:</strong> {selectedOrder.shippingInfo.state}</p>
              <p><strong>Country:</strong> {selectedOrder.shippingInfo.country}</p>
              <p><strong>Pincode:</strong> {selectedOrder.shippingInfo.postalCode}</p>
              <p><strong>Phone:</strong> {selectedOrder.shippingInfo.phone}</p>
            </div>

            <div className="section-box">
              <h3>Items Ordered</h3>
              {selectedOrder.cartItems.map((i, idx) => (
                <div className="item-row" key={idx}>
                  <img src={i.image} alt={i.name} />
                  <div>
                    <p><strong>{i.name}</strong></p>
                    <p>Qty: {i.quantity}</p>
                    <p>Price: ₹{i.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
