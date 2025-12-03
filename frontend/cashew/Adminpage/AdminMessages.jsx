import React, { useEffect, useState } from "react";
import API from "../src/axiosConfig"; // central axios instance
import "../public/AdminMessages.css"; // styling
import { FaEnvelopeOpenText, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  // Fetch Messages
  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  // Toast Notification Handler
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // Delete Message
  const handleDelete = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      fetchMessages();
      showToast("Message deleted successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete message!");
    }
    setConfirmDelete(null);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter Search
  const filteredMessages = messages.filter((msg) =>
    msg.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="msg-page">
      {/* Toast Notification */}
      {toast && <div className="custom-toast">{toast}</div>}

      <header className="msg-header">
        <FaEnvelopeOpenText size={40} className="msg-icon" />
        <h1>Customer Messages</h1>
        <span className="msg-badge">{messages.length} Messages</span>
      </header>

      <div className="msg-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search customer messages..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="msg-grid">
        {filteredMessages.map((msg) => (
          <div key={msg._id} className="msg-card">
            <div onClick={() => setSelectedMessage(msg)} style={{ cursor: "pointer" }}>
              <div className="msg-card-header">
                <h3>{msg.name}</h3>
                <small>{new Date(msg.createdAt).toLocaleDateString()}</small>
              </div>

              <p className="msg-email">{msg.email}</p>
              <p className="msg-preview">{msg.message.slice(0, 80)}...</p>
            </div>

            {/* Delete Button */}
            <button className="delete-btnn" onClick={() => setConfirmDelete(msg)}>
              <MdDelete size={18} /> Delete
            </button>
          </div>
        ))}
      </div>

      {/* MESSAGE DETAILS MODAL */}
      {selectedMessage && (
        <div className="modal-container">
          <div className="modal-box">
            <h2>Message from {selectedMessage.name}</h2>
            <p className="modal-email">📧 {selectedMessage.email}</p>
            <p className="modal-date">
              {new Date(selectedMessage.createdAt).toLocaleString()}
            </p>

            <div className="modal-msg">{selectedMessage.message}</div>

            <div className="modal-actions">
              <button className="close-btn" onClick={() => setSelectedMessage(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDelete && (
        <div className="modal-container">
          <div className="confirm-box">
            <h3>Are you sure?</h3>
            <p>Do you really want to delete this message?</p>

            <div className="modal-actions">
              <button className="close-btn" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={() => handleDelete(confirmDelete._id)}>
                <MdDelete size={18} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
