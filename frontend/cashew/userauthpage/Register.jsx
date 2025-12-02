import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import UserNav from "./UserNav";
import API from "../src/axiosConfig"; // centralized axios instance
import "../public/Register.css";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone must be 10 digits"),
  address: yup.string().required("Address is required"),
});

// Toast component
const ToastMessage = ({ message, type, onClose }) => (
  <div className={`toast-msg ${type}`}>
    {message}
    <button
      onClick={onClose}
      style={{
        marginLeft: "10px",
        background: "transparent",
        border: "none",
        color: "white",
        cursor: "pointer",
        fontSize: "18px",
      }}
    >
      &times;
    </button>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { register: formRegister, handleSubmit, formState: { errors } } =
    useForm({ resolver: yupResolver(schema) });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/register", data);

      if (res.data.status) {
        showToast(`Registration Successful! Welcome, ${data.name}`, "success");
        setTimeout(() => navigate("/userlogin"), 2000);
        return;
      }

      showToast(res.data.message || "Registration Failed", "error");
    } catch (err) {
      showToast(err.response?.data?.message || err.message, "error");
    }
  };

  return (
    <section>
      <UserNav />

      {/* Toast */}
      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}

      <Container>
        <Row
          className="justify-content-center"
          style={{ marginTop: "10px", height: "650px" }}
        >
          <Col xl={10}>
            <Card
              className="border-0 shadow cardd"
              style={{
                width: "800px",
                height: "650px",
                marginLeft: "100px",
                marginTop: "100px",
              }}
            >
              <Card.Body className="p-0">
                <Row>
                  {/* Form */}
                  <Col lg={6}>
                    <div className="p-4">
                      <div className="mb-3 text-center">
                        <h3 className="h4 fw-bold text-primary mt-3">
                          User Registration
                        </h3>
                      </div>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-2">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            {...formRegister("name")}
                          />
                          {errors.name && (
                            <p className="text-danger">{errors.name.message}</p>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            {...formRegister("email")}
                          />
                          {errors.email && (
                            <p className="text-danger">{errors.email.message}</p>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter password"
                            {...formRegister("password")}
                          />
                          {errors.password && (
                            <p className="text-danger">{errors.password.message}</p>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter phone number"
                            {...formRegister("phone")}
                          />
                          {errors.phone && (
                            <p className="text-danger">{errors.phone.message}</p>
                          )}
                        </Form.Group>

                        <Form.Group className="mb-2">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            placeholder="Enter your address"
                            rows={2}
                            {...formRegister("address")}
                          />
                          {errors.address && (
                            <p className="text-danger">{errors.address.message}</p>
                          )}
                        </Form.Group>

                        <Button variant="dark" type="submit" className="w-100">
                          Register
                        </Button>
                      </Form>
                      <p className="mt-3 text-center">
                        Already have an account?{" "}
                        <a href="/userlogin">Login here</a>
                      </p>
                    </div>
                  </Col>

                  {/* Side Info */}
                  <Col lg={6} className="d-none d-lg-block">
                    <div
                      className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-4 rounded-end"
                      style={{ background: "linear-gradient(135deg, #000428, #004e92)" }}
                    >
                      <h5 className="mb-4">Welcome! 👋</h5>
                      <p className="text-center">
                        Create your account to access features, manage your profile,
                        and enjoy a secure experience.
                      </p>
                      <p className="text-white text-center mt-3">
                        Already registered?{" "}
                        <a href="/userlogin" className="text-light fw-bold">
                          Login here
                        </a>
                      </p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
