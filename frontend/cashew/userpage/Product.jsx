import React, { useState } from "react";
import "../public/UserProduct.css";
import BounceCards from "./Cardswap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserNav from "../userauthpage/UserNav";
import API from "../src/axiosConfig"; // centralized axios instance

const Product = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/contact", form);
      Swal.fire("Sent!", "Your message has been sent successfully 😊", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Message not sent", "error");
    }
  };

  // Images should be imported or served from public folder
  const images = [
    "/images/img1.png",
    "/images/img2.png",
    "/images/img3.png",
    "/images/img4.png",
    "/images/img5.png",
  ];

  const transformStyles = [
    "rotate(5deg) translate(-150px)",
    "rotate(0deg) translate(-70px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(70px)",
    "rotate(-5deg) translate(150px)",
  ];

  return (
    <div className="full-page">
      <UserNav />

      {/* ---------------------- WELCOME SECTION ----------------------- */}
      <section className="welcome-section" id="home">
        <div className="welcome-left">
          <h1 className="welcome-title">Welcome to Cashew Delights</h1>
          <p className="welcome-sub">Premium • Fresh • Authentic Cashews</p>
          <p className="welcome-desc">
            Enjoy the finest handpicked cashews directly sourced from organic farms. 
            Our cashews are processed naturally, retaining their rich taste and freshness.
          </p>

          <button className="explore-btn" onClick={() => navigate("/allproducts")}>
            Explore Products
          </button>
        </div>

        <div className="welcome-right">
          <BounceCards
            images={images}
            containerWidth={550}
            containerHeight={330}
            animationDelay={1}
            animationStagger={0.3}
            easeType="elastic.out(1, 0.5)"
            transformStyles={transformStyles}
            enableHover={false}
          />
        </div>
      </section>

      {/* ---------------------- ABOUT SECTION ----------------------- */}
      <section className="about-section" id="about">
        <h2 className="about-title">About Our Brand</h2>

        <p className="about-desc-main">
          At Cashew Delights, we combine quality, purity, and freshness. Every batch goes through a meticulous process to ensure the finest nuts reach your home.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>🌿 100% Natural</h3>
            <p>No chemicals, no additives.</p>
          </div>

          <div className="about-card">
            <h3>⭐ Premium Quality</h3>
            <p>Handpicked and graded for perfection.</p>
          </div>

          <div className="about-card">
            <h3>🚚 Fast Delivery</h3>
            <p>Delivered fresh to your doorstep.</p>
          </div>

          <div className="about-card">
            <h3>🤝 Trusted by Customers</h3>
            <p>Thousands love our premium taste.</p>
          </div>
        </div>
      </section>

      {/* ---------------------- CONTACT SECTION ----------------------- */}
      <section className="contact-section" id="contact">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtext">
          Have questions or bulk orders? We’re here to help!
        </p>

        <div className="contact-container">
          <div className="contact-info">
            <h3>📍 Our Office</h3>
            <p>Cashew Mart Pvt Ltd</p>
            <p>Panruti, Tamil Nadu, India</p>
            <p>Pin: 607106</p>

            <h3>📞 Phone</h3>
            <p>+91 9342506820</p>

            <h3>📧 Email</h3>
            <p>support@cashewdlights.com</p>
          </div>

          <div className="contact-form">
            <h3>Send a Message</h3>

            <form className="form-box" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <textarea
                rows="4"
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit" className="send-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
