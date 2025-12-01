import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../public/UserLogin.css"; // <-- ADD THIS
import UserNav from "./UserNav";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const UserLogin = () => {
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      console.log(res);

      if (res.data.status) {
        console.log(res.data.user._id);

        localStorage.setItem("userId", res.data.user._id);

        Swal.fire({
          title: "Login Successful 🎉",
          text: `Welcome back!`,
          icon: "success",
        });

        navigate("/");
        return;
      }

      Swal.fire({
        title: "Invalid Credentials ❌",
        text: "Please check your email or password",
        icon: "error",
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        title: "Server Error",
        text: err.response?.data?.message || err.message,
        icon: "error",
      });
    }
  };

  return (
    <section>
      <UserNav />

      <Container className="login-wrapper">
        <Card className="login-card shadow-lg" style={{ marginTop: "0px" }}>
          <Row className="g-0">
            {/* FORM SIDE */}
            <Col lg={6} className="login-form-side">
              <div className="text-center mb-4">
                {/* <img src="./src/wb1.jpg" alt="Logo" className="login-logo" /> */}
                <h3 className="fw-bold mt-3 text-primary"> User Login </h3>
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
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

                <Form.Group className="mb-3">
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

                <Button variant="dark" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            </Col>

            {/* RIGHT SIDE */}
            <Col lg={6} className="login-image-side d-none d-lg-flex">
              <h3 className="text-white">Welcome Back 👋</h3>

              <p className="text-center text-light mt-3">
                Access your dashboard, manage your account, and shop the best
                cashew products.
              </p>

              <p className="text-center mt-3" style={{ color: "white" }}>
                Don't have an account? <a href="/register">Register here</a>
              </p>
            </Col>
          </Row>
        </Card>
      </Container>
    </section>
  );
};

export default UserLogin;
