import React, { useEffect, useState } from "react";
import API from "../src/axiosConfig";   // <-- using central baseURL config
import "../public/AdminMessages.css";
import { FaEnvelopeOpenText, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await API.get("/messages");
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await API.delete(`/messages/${id}`);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) =>
    msg.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="msg-page">
      {/* HEADER */}
      <header className="msg-header">
        <FaEnvelopeOpenText size={40} className="msg-icon" />
        <h1>Customer Messages</h1>
        <span className="msg-badge">{messages.length} Messages</span>
      </header>

      {/* SEARCH */}
      <div className="msg-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search customer messages..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MESSAGE CARDS */}
      <div className="msg-grid">
        {filteredMessages.map((msg) => (
          <div
            key={msg._id}
            className="msg-card"
            onClick={() => setSelectedMessage(msg)}
          >
            <div className="msg-card-header">
              <h3>{msg.name}</h3>
              <small>{new Date(msg.createdAt).toLocaleDateString()}</small>
            </div>

            <p className="msg-email">{msg.email}</p>
            <p className="msg-preview">{msg.message}</p>

            <button
              className="delete-btnn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(msg._id);
              }}
              
            >
              <MdDelete size={18} /> Delete
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
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
              <button
                className="delete-btn"
                onClick={() => {
                  handleDelete(selectedMessage._id);
                  setSelectedMessage(null);
                }}
              >
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
