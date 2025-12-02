import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../public/AllProduct.css";
import { ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";

import { AiOutlineShoppingCart, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaStar, FaRegStar } from "react-icons/fa";

import { useDispatch } from "react-redux";
import { addItem } from "../store/CartSlice";
import api from "../src/axiosConfig";
import UserNav from "../userauthpage/UserNav";

const AllUserProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  // Fetch products
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product");
        if (!mounted) return;

        const products = res.data.products || res.data || [];
        setAllProducts(products);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();

    return () => (mounted = false);
  }, []);

  // Add to cart
  const addToCart = (product) => {
    if (!userId) {
      setToastMsg("You must be logged in to add to cart.");
      setTimeout(() => setToastMsg(""), 2000);
      return;
    }

    dispatch(
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        quantity: 1,
      })
    );

    setToastMsg(`${product.name} added to cart ✓`);
    setTimeout(() => setToastMsg(""), 2500);
  };

  // Toggle wishlist
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Compute rating UI
  const computeRatingUi = (item) => {
    const r = item.rating ?? item.avgRating ?? 4.2;
    const full = Math.floor(r);
    const stars = Array.from({ length: 5 }, (_, i) =>
      i < full ? <FaStar key={i} /> : <FaRegStar key={i} />
    );
    return {
      stars,
      rating: r.toFixed(1),
      reviews:
        item.numReviews || item.reviews || Math.floor(Math.random() * 200) + 10,
    };
  };

  if (isLoading) {
    return (
      <>
        <UserNav />
        <div className="loading-wrap">
          <ThreeDot color="#32cd32" size="medium" text="Loading Product..." />
        </div>
      </>
    );
  }

  return (
    <section className="allproduct">
      <UserNav />
      {toastMsg && <div className="cart-success-toast">{toastMsg}</div>}

      <div className="ap-container">
        <h2 className="ap-heading">Our Products</h2>
        {error && <div className="ap-error">{error}</div>}

        <div className="ap-grid">
          {allProducts.length === 0 && <div className="empty-msg">No products found</div>}

          {allProducts.map((item) => {
            const id = item._id || item.id;
            const { stars, rating, reviews } = computeRatingUi(item);

            return (
              <Card className="ap-card" key={id}>
                <div
                  className="ap-card-media"
                  onClick={() => navigate(`/productdetails/${id}`)}
                >
                  <img src={item.image} alt={item.name} className="ap-card-img" />
                </div>

                <Card.Body className="ap-card-body">
                  <div className="ap-title hide-scrollbar" title={item.name}>
                    {item.name}
                  </div>

                  <div className="ap-sub">
                    <div className="ap-price">₹{item.price}</div>
                    <div className="ap-mrp">MRP ₹{item.mrp ?? Math.round(item.price * 1.12)}</div>
                  </div>

                  <div className="ap-rating-row">
                    <div className="ap-stars">{stars}</div>
                    <div className="ap-rating-text">{rating} • {reviews}</div>
                  </div>
                </Card.Body>

                <Card.Footer className="ap-card-footer">
                  <div className="ap-actions-left">
                    <Button
                      variant="light"
                      className="ap-add-btn"
                      onClick={() => addToCart(item)}
                      title="Add to cart"
                    >
                      <AiOutlineShoppingCart /> <span className="ap-btn-text">Add</span>
                    </Button>

                    <Button
                      className="ap-buy-btn"
                      onClick={() => navigate(`/productdeatils/${id}`)}
                      title="Order Now"
                    >
                      Order
                    </Button>
                  </div>

                  <button
                    className={`ap-wish-btn ${wishlist.includes(id) ? "saved" : ""}`}
                    onClick={() => toggleWishlist(id)}
                  >
                    {wishlist.includes(id) ? <AiFillHeart /> : <AiOutlineHeart />}
                  </button>
                </Card.Footer>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AllUserProduct;
