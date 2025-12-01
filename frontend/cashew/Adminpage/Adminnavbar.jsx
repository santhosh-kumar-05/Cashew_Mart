import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faPlus,
  faBoxOpen,
  faClipboardList,
  faChartSimple,
  faUserShield,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "../public/Adiminav.css";

const AdminNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg admin-nav shadow-sm py-2 sticky-top">
      <div className="container">

        {/* Brand */}
        <Link className="navbar-brand admin-brand d-flex align-items-center" to="/">
          <img
            src="https://img.icons8.com/fluency/48/admin-settings-male.png"
            width="32"
            className="me-2"
            alt="logo"
          />
          AdminZone
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="adminMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-3 admin-menu">

            <li className="nav-item">
              <Link className="nav-link admin-link" to="/admindashboard">
                <FontAwesomeIcon icon={faGaugeHigh} className="me-1" />
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link admin-link text-success" to="/addproduct">
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                Add Product
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link className="nav-link admin-link" to="/admin/manage-products">
                <FontAwesomeIcon icon={faBoxOpen} className="me-1" />
                Manage
              </Link>
            </li> */}

            <li className="nav-item">
              <Link className="nav-link admin-link text-warning" to="/admin/orders">
                <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                Orders
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link admin-link text-primary" to="/admin/reports">
                <FontAwesomeIcon icon={faChartSimple} className="me-1" />
                Reports
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link admin-link text-info" to="/admin/profile">
                <FontAwesomeIcon icon={faUserShield} className="me-1" />
                Profile
              </Link>
            </li>

            <li className="nav-item">
              <button className="btn btn-danger px-3 rounded-pill logout-btn">
                <FontAwesomeIcon icon={faRightFromBracket} className="me-1" />
                Logout
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
};

export default AdminNavbar;
