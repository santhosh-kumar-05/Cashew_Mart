import React, { useState, useEffect } from "react";
import { faHeart, faCartShopping, faBox, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const UserNavber = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(null);

  const userId = localStorage.getItem("userId");

  // Fetch user profile
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/auth/profile/${userId}`)
        .then((res) => {
          console.log(res);
          
          if (res.data.status) setUserData(res.data.user);
        })
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserData(null);
    setShowProfile(false);
    navigate("/userlogin");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm py-3 sticky-top nav-blur">
        <div className="container">
          {/* Brand */}
          <a className="navbar-brand fw-bold d-flex align-items-center" href="#home" style={{ color: "orange" }}>
            <img src="https://img.icons8.com/color/48/cashew.png" width="35" className="me-2" alt="logo" />
            CashewMart
          </a>

          {/* Mobile Toggle */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto align-items-center gap-4">
              <li className="nav-item"><Link className="nav-link fw-semibold" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link fw-semibold" to="/allproducts">Products</Link></li>
              <li className="nav-item"><a className="nav-link fw-semibold" href="#about">About</a></li>
              <li className="nav-item"><a className="nav-link fw-semibold" href="#contact">Contact</a></li>

              {/* Wishlist */}
              <li className="nav-item">
                <a className="nav-link text-danger fw-semibold d-flex align-items-center" href="#">
                  <FontAwesomeIcon icon={faHeart} className="me-1" /> Favourite
                </a>
              </li>

              {/* Cart */}
              <li className="nav-item position-relative">
                <Link className="nav-link text-primary fw-semibold d-flex align-items-center" to="/cart">
                  <FontAwesomeIcon icon={faCartShopping} className="me-1" /> Cart
                  <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">3</span>
                </Link>
              </li>

              {/* Profile */}
              {userData ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-primary rounded-circle"
                    onClick={() => setShowProfile(true)}
                    title="Profile"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <button
                    className="btn px-3 rounded-pill fw-semibold"
                    onClick={() => navigate("/userlogin")}
                    style={{ backgroundColor: "orange", color: "white" }}
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Offcanvas */}
      {showProfile && userData && (
        <div className="offcanvas offcanvas-end show" style={{ visibility: "visible" }}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Profile</h5>
            <button type="button" className="btn-close" onClick={() => setShowProfile(false)}></button>
          </div>
          <div className="offcanvas-body">
            <div className="text-center mb-3">
              <img
                src={userData.avatar || "https://via.placeholder.com/100"}
                className="rounded-circle mb-2"
                width="100"
                alt="avatar"
              />
              <h5>{userData.name}</h5>
              <p className="text-muted">{userData.email}</p>
            </div>
            <ul className="list-group">
              <li className="list-group-item"><strong>Phone:</strong> {userData.phone || "Not set"}</li>
              <li className="list-group-item"><strong>Address:</strong> {userData.address || "Not set"}</li>
              <li className="list-group-item"><strong>Role:</strong> {userData.role}</li>
            </ul>
            <button className="btn btn-danger mt-3 w-100" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavber;
