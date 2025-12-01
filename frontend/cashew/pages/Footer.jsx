import React from "react";
import "../public/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">

        {/* About */}
        <div className="footer-col">
          <h2>Cashew Delights</h2>
          <p>
            Bringing you the finest cashews from our farms — fresh, crunchy, and full of flavor.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#products">Products</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#login">Login</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h2>Contact</h2>
          <p>Email: support@cashewdelights.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Cashew Street, Chennai, India</p>
        </div>

      </div>

      <div className="footer-divider"></div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Cashew Delights. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
