import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../src/axiosConfig"; // ✅ Use central Axios instance
import "../public/AddProduct.css";

const AdminUpdateProduct = ({ id }) => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        const p = res.data.products;

        setProduct({
          name: p.name,
          category: p.category,
          description: p.description,
          price: p.price,
          stock: p.stock,
        });

        // Show existing backend image
        if (p.image) {
          setPreview(`${p.image}`);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Update product
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

      await API.put(`/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
      setProduct({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
      });
      setImage(null);
      setPreview(null);
      navigate("/admindashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  return (
    <section className="add-product-page">
      <div className="page-header">
        <h2>Update Product</h2>
      </div>

      <div className="product-card full-card">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label className="input-label">Product Name</label>
          <input
            type="text"
            className="input-field"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />

          <label className="input-label">Category</label>
          <input
            type="text"
            className="input-field"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />

          <label className="input-label">Description</label>
          <textarea
            className="input-field textarea"
            name="description"
            value={product.description}
            onChange={handleChange}
          />

          <div className="row-flex">
            <div className="col-half">
              <label className="input-label">Price</label>
              <input
                type="number"
                className="input-field"
                name="price"
                value={product.price}
                onChange={handleChange}
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
                required
              />
            </div>
          </div>

          <label className="input-label">Upload Image</label>
          <input
            type="file"
            className="input-field"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="preview" />
            </div>
          )}

          <button className="submit-btn">Update Product</button>
        </form>
      </div>
    </section>
  );
};

export default AdminUpdateProduct;
