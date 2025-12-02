import React, { useEffect } from "react";
import UserNav from "../userauthpage/UserNav";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "../public/AllProduct.css";
import { fetchCart, removeItem } from "../store/CartSlice";
import { ThreeDot } from "react-loading-indicators";

const Cartt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartproduct, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart()); // fetchCart reads userId from localStorage
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(removeItem(id));
  };

  if (loading)
    return (
      <div>
        <UserNav />
        <h2 style={{ textAlign: "center", marginTop: 40 }}>
          <div className="loading-wrap">
            <ThreeDot color="#32cd32" size="medium" text="Loading Product..." />
          </div>
        </h2>
      </div>
    );

  return (
    <section className="allproduct">
      <UserNav />
      {cartproduct.length > 0 ? (
        <div className="ap-container">
          <h2 className="ap-heading">CART PAGE</h2>

          <div className="ap-grid">
            {cartproduct.map((item) => (
              <Card className="ap-card" key={item._id}>
                <div
                  className="ap-card-media"
                  onClick={() => navigate(`/productdeatils/${item.productId}`)}
                >
                  <img
                    src={`${item.image}`}
                    alt={item.name}
                    className="ap-card-img"
                  />
                </div>
                <Card.Body className="ap-card-body">
                  <div className="ap-title">{item.name}</div>
                  <div className="ap-sub">
                    <div className="ap-price">₹{item.price}</div>
                    <div className="ap-qty">Qty: {item.quantity}</div>
                  </div>
                </Card.Body>
                <Card.Footer className="ap-card-footer">
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    <AiFillDelete /> Delete
                  </Button>
                  <Button
                    className="ap-buy-btn"
                    onClick={() =>
                      navigate(`/productdeatils/${item.productId}`)
                    }
                  >
                    Order
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <h1 style={{ textAlign: "center", marginTop: 50 }}>
          Your cart is empty 🛒
        </h1>
      )}
    </section>
  );
};

export default Cartt;
