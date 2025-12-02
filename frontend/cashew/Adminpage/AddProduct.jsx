import React, { useState, useEffect } from "react";
import API from "../src/axiosConfig";
import "../public/AddProduct.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <span className="toast-icon">✔</span>
      <span className="toast-message">{message}</span>
    </div>
  );
};

const AddProduct = ({ refreshProducts, setPage }) => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(product).forEach((key) => formData.append(key, product[key]));
      if (image) formData.append("image", image);

      await API.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowToast(true);

      setProduct({ name: "", category: "", description: "", price: "", stock: "" });
      setImage(null);
      setPreview(null);

      setTimeout(() => {
        refreshProducts();
        setPage("dashboard");
      }, 800);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="add-product-page">
      
      {showToast && (
        <Toast
          message="Product Added Successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="page-header">
        <h2>Add New Product</h2>
      </div>

      <div className="product-card full-card" style={{ height: "490px" }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          
          <label className="input-label">Product Name</label>
          <input
            type="text"
            className="input-field"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />

          <label className="input-label">Category (ObjectId)</label>
          <input
            type="text"
            className="input-field"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Enter category ID"
            required
          />

          <label className="input-label">Description</label>
          <textarea
            className="input-field textarea"
            rows="3"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Enter product description"
          ></textarea>

          <div className="row-flex">
            <div className="col-half">
              <label className="input-label">Price</label>
              <input
                type="number"
                className="input-field"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="₹ Price"
                required
              />
            </div>

            <div className="col-half">
              <label className="input-label">Stock</label>
              <input
                type="number"
                className="input-field"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Available stock"
              />
            </div>
          </div>

          <label className="input-label">Upload Product Image</label>
          <input
            type="file"
            className="input-field"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="preview" />
            </div>
          )}

          <button className="submit-btn">Add Product</button>
        </form>
      </div>
    </section>
  );
};

export default AddProduct;
