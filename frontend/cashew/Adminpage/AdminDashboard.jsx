import React, { useEffect, useState } from "react";
import {
  faBoxOpen,
  faClipboardList,
  faIndianRupeeSign,
  faUsers,
  faPlus,
  faEdit,
  faTrash,
  faBars,
  faBell,
  faUserCircle,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../src/axiosConfig";
import "../public/Dashboard.css";

import AddProduct from "./AddProduct";
import AdminUpdateProduct from "./AdminUpdateProduct";
import AdminOrders from "./AdminOrders";
import AdminMessages from "./AdminMessages";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customerCount, setCustomerCount] = useState([]); // 👈 NEW
  const [page, setPage] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/product");
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/all");
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/messages"); // 👈 must return customerCount
      setCustomerCount(res.data.messages);
      console.log(res.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCustomers(); // 👈 NEW
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await API.delete(`/product/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePageChange = (value) => {
    setPage(value);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    setProfileOpen(false);
    window.location.href = "/adminlogin";
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <div className="stats-section mobile-scroll">
            <div className="stat-item gradient-blue">
              <FontAwesomeIcon icon={faBoxOpen} className="stat-icon" />
              <h5>Total Products</h5>
              <h2>{products.length}</h2>
            </div>

            <div className="stat-item gradient-purple">
              <FontAwesomeIcon icon={faClipboardList} className="stat-icon" />
              <h5>Total Orders</h5>
              <h2>{orders.length}</h2>
            </div>

            <div className="stat-item gradient-green">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="stat-icon" />
              <h5>Revenue</h5>
              <h2>
                ₹
                {orders.reduce(
                  (sum, order) => sum + (order?.totalPrice || 0),
                  0
                )}
              </h2>
            </div>

            <div className="stat-item gradient-orange">
              <FontAwesomeIcon icon={faUsers} className="stat-icon" />
              <h5>Customers</h5>
              <h2>{customerCount.length}</h2> {/* 👈 Display */}
            </div>
          </div>
        );

      case "addproduct":
        return <AddProduct refreshProducts={fetchProducts} setPage={setPage} />;
      case "updateproduct":
        return <AdminUpdateProduct id={selectedId}refreshProducts={fetchProducts} setPage={setPage} />;


      case "orders":
        return <AdminOrders />;

      case "customers":
        return <AdminMessages />;

      default:
        return <h3>Dashboard</h3>;
    }
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="logo">MyAdmin</h2>
        <ul className="side-menu">
          <li onClick={() => handlePageChange("dashboard")}>
            <FontAwesomeIcon icon={faBoxOpen} /> Dashboard
          </li>
          <li onClick={() => handlePageChange("addproduct")}>
            <FontAwesomeIcon icon={faPlus} /> Add Product
          </li>
          <li onClick={() => handlePageChange("orders")}>
            <FontAwesomeIcon icon={faClipboardList} /> Orders
          </li>
          <li onClick={() => handlePageChange("customers")}>
            <FontAwesomeIcon icon={faUsers} /> Customers
          </li>
        </ul>
      </aside>

      {(sidebarOpen || profileOpen) && (
        <div
          className="overlay"
          onClick={() => {
            setSidebarOpen(false);
            setProfileOpen(false);
          }}
        ></div>
      )}

      <main className="main-content">
        <nav className="top-navbar">
          <div className="left-nav">
            <FontAwesomeIcon
              className="menu-icon mobile-menu-btn"
              icon={faBars}
              onClick={() => setSidebarOpen(true)}
            />
            <h3>{page.toUpperCase()}</h3>
          </div>
          <div className="right-nav">
            <FontAwesomeIcon className="nav-icon" icon={faBell} />
            <FontAwesomeIcon
              className="nav-icon profile"
              icon={faUserCircle}
              onClick={() => setProfileOpen(true)}
            />
          </div>
        </nav>

        {renderPage()}

        {page === "dashboard" && (
          <>
            <div className="product-header">
              <h3>Manage Products</h3>
              <button
                className="add-product-btn"
                onClick={() => setPage("addproduct")}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Product
              </button>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <div className="product-card adpro" key={product._id}>
                  <img src={`${product.image}`} alt={product.name} />
                  <h5 className="product-title">{product.name}</h5>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                  <div className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedId(product._id);
                        setPage("updateproduct");
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {profileOpen && (
        <div className="profile-offcanvas">
          <div className="profile-header">
            <h3>My Profile</h3>
            <button onClick={() => setProfileOpen(false)}>X</button>
          </div>
          <div className="profile-content">
            <p>
              <FontAwesomeIcon icon={faUserCircle} /> Admin User
            </p>
            <p onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
