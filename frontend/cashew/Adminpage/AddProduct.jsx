import React, { useState } from "react";
import API from "../src/axiosConfig"; // ✅ Use the Axios instance
import "../public/AddProduct.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

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
      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      if (image) formData.append("image", image);

      await API.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // ✅ Use API base URL
      });

      alert("Product Added Successfully!");
      setProduct({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to Add Product!");
    }
  };

  return (
    <section className="add-product-page">
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
