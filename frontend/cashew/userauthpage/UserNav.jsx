import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import {
  faCartShopping,
  faBox,
  faRightToBracket,
  faUserCircle,
  faHome,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import "../public/UserNav.css";
import API from "../src/axiosConfig";

const UserNav = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const profileRef = useRef(null); // Refs for outside click

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      API.get(`/auth/profile/${storedUserId}`)
        .then((res) => {
          if (res.data?.status && res.data?.user) {
            setUserData(res.data.user);
          }
        })
        .catch((err) => console.error(err));
    }

    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartCount(storedCart.length);
  }, []);

  // Outside click close effect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserData(null);
    setProfileOpen(false);
    navigate("/userlogin");
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="user-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="brand" to="/">
            CashewMart
          </Link>

          <ul className="nav-menu d-none d-lg-flex gap-4 align-items-center">
            <li>
              <Link className="nav-link-custom" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="nav-link-custom" to="/allproducts">
                Products
              </Link>
            </li>
            <li>
              <Link
                className="nav-link-custom cart-link position-relative"
                to="/cart"
              >
                <FontAwesomeIcon icon={faCartShopping} className="me-1" /> Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>
            <li>
              <Link className="nav-link-custom" to="/myorder">
                <FontAwesomeIcon icon={faBox} className="me-1" /> My Order
              </Link>
            </li>

            {userData ? (
              <li>
                <button className="profile-btn" onClick={toggleProfile}>
                  <FontAwesomeIcon icon={faUserCircle} className="me-1" /> Profile
                </button>
              </li>
            ) : (
              <li>
                <button
                  className="login-btn"
                  onClick={() => navigate("/userlogin")}
                >
                  <FontAwesomeIcon icon={faRightToBracket} className="me-1" /> Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div className="mobile-nav d-lg-none">
        <button className="mobile-btn" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </button>

        <button className="mobile-btn" onClick={() => navigate("/allproducts")}>
          <FontAwesomeIcon icon={faThLarge} />
          <span>Products</span>
        </button>

        <button
          className="mobile-btn position-relative"
          onClick={() => navigate("/cart")}
        >
          <FontAwesomeIcon icon={faCartShopping} />
          <span>Cart</span>
          {cartCount > 0 && (
            <small className="mobile-cart-count">{cartCount}</small>
          )}
        </button>

        <button className="mobile-btn" onClick={() => navigate("/myorder")}>
          <FontAwesomeIcon icon={faBox} />
          <span>Orders</span>
        </button>

        <button className="floating-profile-btn" onClick={toggleProfile}>
          <FontAwesomeIcon icon={faUserCircle} />
        </button>
      </div>

      {/* PROFILE DROPDOWN */}
      {profileOpen && (
        <div className="profile-dropdown-container">
          <div className="profile-card" ref={profileRef}> {/* ref moved here */}
            <div className="profile-header">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="profile-big-icon"
              />
              <h4>{userData ? userData.name : "Guest User"}</h4>
              <p>{userData ? userData.email : "guest@example.com"}</p>
            </div>

            <button
              className="profile-menu-item"
              onClick={() => navigate("/myorder")}
            >
              📦 My Orders
            </button>
            <button
              className="profile-menu-item"
              onClick={() => navigate("/cart")}
            >
              🛒 My Cart
            </button>
            <button
              className="profile-menu-item logout-btn"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNav;
