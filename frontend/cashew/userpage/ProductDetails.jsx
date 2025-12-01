import React, { useEffect, useState, useRef } from "react";
import "../public/ProductDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineShoppingCart,
} from "react-icons/ai";
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

  // ⭐ Review section states
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");

  const thumbsRef = useRef(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  // =============================
  // ⭐ FETCH PRODUCT
  // =============================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/product/${id}`);
        const data = res.data.products || res.data;

        const images = Array.isArray(data.images)
          ? data.images
          : data.image
          ? [data.image]
          : data.imagesList || [];

        const normalized = { ...data, images };

        normalized.price = Number(data.price) || 0;
        normalized.mrp = Number(data.mrp) || Math.round(normalized.price * 1.2);
        normalized.stock = Number(data.stock) || 0;
        setReviews(normalized.reviews);

        setProduct(normalized);
        setMainImage(normalized.images[0] || "");
      } catch (err) {
        console.error("fetch error:", err.message);
      }
    };

    fetchProduct();
  }, [id]);

  console.log(reviews);

  // =============================
  // ⭐ FETCH REVIEWS
  // =============================

  if (!product)
    return (
      <div>
        <UserNav />
        <h2 style={{ textAlign: "center", marginTop: 100 }}>
          <ThreeDot color="#32cd32" size="medium" text="Loading Product" />
        </h2>
      </div>
    );

  const totalPrice = product.price * qty;
  const totalMrp = product.mrp * qty;

  // =============================
  // ⭐ ADD TO CART
  // =============================
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
        image: product.images[0],
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

  // =============================
  // ⭐ SUBMIT REVIEW
  // =============================
  const submitReview = async () => {
    if (!myRating || !myComment) {
      showToast("Please add rating & comment");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/product/${id}/reviews`, {
        rating: myRating,
        comment: myComment,
        user: "Guest User",
      });

      showToast("Review submitted");
      setMyRating(0);
      setMyComment("");
      fetchReviews();
    } catch (err) {
      console.log("Review error", err);
    }
  };

  const rating = product.rating || 4.3;
  let userId = localStorage.getItem("userId");

  let BuyNow = (id) => {
    if (!userId) {
      showToast("You must be logged in to add to cart.");
    } else {
      navigate(`/shiping/${id}`);
    }
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
                  src={
                    img.startsWith("http") ? img : `http://localhost:5000${img}`
                  }
                  className="thumb"
                  onClick={() => setMainImage(img)}
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
              src={
                mainImage.startsWith("http")
                  ? mainImage
                  : `http://localhost:5000${mainImage}`
              }
              className="main-image-zoom"
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

          {/* PRICE */}
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
            Delivery by{" "}
            <strong>
              {new Date(Date.now() + 2 * 86400000).toDateString()}
            </strong>
          </div>

          {/* QUANTITY */}
          <div className="action-row">
            {/* <div className="qty">
              <button
                className="qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <AiOutlineMinus />
              </button>
              <div className="qty-num">{qty}</div>
              <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>
                <AiOutlinePlus />
              </button>
            </div> */}

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

          {/* DESCRIPTION */}
          <div className="specs">
            <h3>Product Description</h3>
            <p className="desc">
              {product.description || "No description available"}
            </p>
          </div>

          {/* ============== ⭐ REVIEW SECTION ============== */}
          <div className="review-section">
            <h2>Ratings & Reviews</h2>

            {/* SUMMARY */}
            <div className="review-summary">
              <div className="big-rating">{rating.toFixed(1)} ⭐</div>
              <div className="total-reviews">{reviews.length} Reviews</div>
            </div>

            {/* FORM */}
            {/* <div className="write-review">
              <h3>Write a Review</h3>

              <div className="rating-select">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setMyRating(i + 1)}
                    style={{ cursor: "pointer", fontSize: 22, color: i < myRating ? "gold" : "#999" }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Write your review..."
                value={myComment}
                onChange={(e) => setMyComment(e.target.value)}
              />

              <button className="submit-review" onClick={submitReview}>
                Submit Review
              </button>
            </div> */}

            {/* ALL REVIEWS */}
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
                    <div className="rev-user">{r.name} </div>
                    <div className="rev-comment">{r.comment}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* END REVIEW SECTION */}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
