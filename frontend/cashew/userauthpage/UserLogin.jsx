import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import UserNav from "./UserNav";
import API from "../src/axiosConfig";
import "../public/UserLogin.css";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Toast Component
const ToastMessage = ({ message, type, onClose }) => (
  <div className={`toast-msg ${type}`}>
    {message}
    <button onClick={onClose} style={{ marginLeft: "10px", background: "transparent", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}>&times;</button>
  </div>
);

const UserLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Login data sent:", data); // Debug payload
      const res = await API.post("/auth/login", data);

      if (res.data.status) {
        localStorage.setItem("userId", res.data.user._id);
        showToast("Login Successful 🎉", "success");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      showToast(res.data.message, "error");
    } catch (err) {
      console.log(err.response?.data); // Debug backend error
      showToast(err.response?.data?.message || "Server Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <UserNav />

      {/* Toast */}
      {toast.show && <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast({ show: false })} />}

      <Container className="login-wrapper">
        <Card className="login-card shadow-lg">
          <Row className="g-0">
            {/* FORM SIDE */}
            <Col lg={6} className="login-form-side">
              <div className="text-center mb-4">
                <h3 className="fw-bold mt-3 text-primary">User Login</h3>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-labell">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...register("password")}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  {errors.password && <p className="text-danger">{errors.password.message}</p>}
                </Form.Group>

                <Button variant="dark" type="submit" className="w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="mobilelog">
                  <p className="text-center mt-3" style={{ color: "white" }}>
                    Don't have an account? <a href="/register">Register here</a>
                  </p>
                  <p className="text-center mt-3" style={{ color: "white" }}>
                    <a href="/adminlogin">Admin here</a>
                  </p>
                </div>
              </Form>
            </Col>

            {/* RIGHT SIDE */}
            <Col lg={6} className="login-image-side d-none d-lg-flex">
              <h3 className="text-white">Welcome Back 👋</h3>
              <p className="text-center text-light mt-3">
                Access your dashboard, manage your account, and shop the best cashew products.
              </p>
              <p className="text-center mt-3" style={{ color: "white" }}>
                Don't have an account? <a href="/register">Register here</a>
              </p>
              <p className="text-center mt-3" style={{ color: "white" }}>
                <a href="/adminlogin">Admin here</a>
              </p>
            </Col>
          </Row>
        </Card>
      </Container>
    </section>
  );
};

export default UserLogin;
