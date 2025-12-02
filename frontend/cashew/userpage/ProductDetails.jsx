import React, { useEffect, useState, useRef } from "react";
import "../public/ProductDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import API from "../src/axiosConfig"; // use your configured axios instance
import UserNav from "../userauthpage/UserNav";
import { ThreeDot } from "react-loading-indicators";

// ICONS
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaShippingFast,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RiPriceTag3Line } from "react-icons/ri";

import { useDispatch } from "react-redux";
import { addItem } from "../store/CartSlice";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [reviews, setReviews] = useState([]);

  const thumbsRef = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ================================
  // FETCH PRODUCT
  // ================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`); // uses API instance
        const data = res.data.products || res.data;

        // Normalize images
        const images = Array.isArray(data.images)
          ? data.images
          : data.image
          ? [data.image]
          : data.imagesList || [];

        const normalized = { ...data, images };
        normalized.price = Number(data.price) || 0;
        normalized.mrp = Number(data.mrp) || Math.round(normalized.price * 1.2);
        normalized.stock = Number(data.stock) || 0;

        setReviews(normalized.reviews || []);
        setProduct(normalized);
        setMainImage(normalized.images[0] || "");
      } catch (err) {
        console.error("fetch error:", err.message);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div>
        <UserNav />
        <h2 style={{ textAlign: "center", marginTop: 100 }}>
          <ThreeDot color="#32cd32" size="medium" text="Loading Product" />
        </h2>
      </div>
    );
  }

  const totalPrice = product.price * qty;
  const totalMrp = product.mrp * qty;
  const rating = product.rating || 4.3;

  // ================================
  // ADD TO CART
  // ================================
  const handleAddToCart = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast("You must be logged in to add to cart.");
      return;
    }

    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: mainImage, // direct path
        quantity: qty,
      })
    );

    showToast(`${product.name} added to cart ✅`);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const BuyNow = (id) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast("You must be logged in to buy.");
      return;
    }
    navigate(`/shiping/${id}`);
  };

  return (
    <section className="pd-page">
      <UserNav />

      {/* Toast */}
      {toastVisible && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "20px",
            backgroundColor: "#4BB543",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          {toastMsg}
        </div>
      )}

      <div className="product-container">
        {/* LEFT GALLERY */}
        <div className="gallery-col">
          <div className="thumbs-outer">
            <button
              className="thumb-arrow left"
              onClick={() =>
                thumbsRef.current.scrollBy({ left: -88, behavior: "smooth" })
              }
            >
              <FaChevronLeft />
            </button>

            <div className="thumbnail-strip" ref={thumbsRef}>
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img} // no base URL
                  className="thumb"
                  onClick={() => setMainImage(img)}
                  alt={`thumb-${idx}`}
                />
              ))}
            </div>

            <button
              className="thumb-arrow right"
              onClick={() =>
                thumbsRef.current.scrollBy({ left: 88, behavior: "smooth" })
              }
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="main-image-wrap">
            <img
              src={mainImage} // direct path
              className="main-image-zoom"
              alt={product.name}
            />
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="details-col">
          <h1 className="pd-title">{product.name}</h1>

          <div className="rating-row">
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < Math.floor(rating) ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            <div className="review-count">
              {rating.toFixed(1)} ⭐ • {reviews.length} reviews
            </div>
          </div>

          <div className="price-row">
            <div className="price">₹{totalPrice}</div>
            <div className="mrp">MRP ₹{totalMrp}</div>
            <div className="discount">(Save up to 30%)</div>
          </div>

          <div className="offer-row">
            <RiPriceTag3Line className="tag" />
            <ul className="offers">
              <li>Bank Offer: 5% instant discount</li>
              <li>Special Price: Extra 10% off</li>
              <li>Combo: Buy 2 Get 1 Free</li>
            </ul>
          </div>

          <div className="delivery-row">
            <FaShippingFast />
            Delivery by <strong>{new Date(Date.now() + 2 * 86400000).toDateString()}</strong>
          </div>

          <div className="action-row">
            <button className="add-cart-btn" onClick={handleAddToCart}>
              <AiOutlineShoppingCart /> Add to Cart
            </button>

            <button className="buy-now-btn" onClick={() => BuyNow(id)}>
              Buy Now
            </button>

            <button
              className={`wishlist-btn ${wishlist ? "saved" : ""}`}
              onClick={() => setWishlist((s) => !s)}
            >
              <FaHeart />
            </button>
          </div>

          <div className="specs">
            <h3>Product Description</h3>
            <p className="desc">{product.description || "No description available"}</p>
          </div>

          <div className="review-section">
            <h2>Ratings & Reviews</h2>
            <div className="review-summary">
              <div className="big-rating">{rating.toFixed(1)} ⭐</div>
              <div className="total-reviews">{reviews.length} Reviews</div>
            </div>

            <div className="review-list">
              {reviews.length === 0 ? (
                <p>No reviews yet</p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="single-review">
                    <div className="rev-stars">
                      {Array.from({ length: r.rating }).map((_, i2) => (
                        <FaStar key={i2} color="gold" />
                      ))}
                    </div>
                    <div className="rev-user">{r.name}</div>
                    <div className="rev-comment">{r.comment}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
