import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../public/AdminLogin.css";

// ✅ Validation schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/admin/login", data);
      console.log("Response:", res.data);

      if (res.data.message === "Login Successful") {
        Swal.fire({
          title: "Admin Login Successful 🎉",
          text: `Welcome, ${data.username}!`, // use entered username
          icon: "success",
        });

        // Save token
        localStorage.setItem("adminToken", res.data.token);

        // Redirect to dashboard
        navigate("/admindashboard");
        return;
      }

      Swal.fire({
        title: "Invalid Credentials ❌",
        text: "Please check your username and password",
        icon: "error",
      });
    } catch (err) {
      console.error("Login Error:", err);

      Swal.fire({
        title: "Server Error",
        text: err.response?.data?.message || err.message,
        icon: "error",
      });
    }
  };

  return (
    <Container>
      <Row
        className="justify-content-center"
        style={{ height: "300px", marginTop: "100px" }}
      >
        <Col xl={10}>
          <Card
            className="border-0 shadow adminlogin"
            style={{
              width: "700px",
              height: "500px",
              marginLeft: "100px",
              marginBottom: "200px",
            }}
          >
            <Card.Body className="">
              <Row>
                {/* Left side: Form */}
                <Col lg={6}>
                  <div className="p-3">
                    <div className="mb-3 text-center">
                      <div className="logo">
                        {/* <img src="./src/wb1.jpg" alt="Logo" /> */}
                      </div>
                      <h3 className="h4 fw-bold text-primary mt-3">
                        Admin Login Portal
                      </h3>
                    </div>

                    <p className="text-muted mt-2 mb-3 text-center">
                      Authorized Access Only 🚀
                    </p>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                      {/* Username */}
                      <Form.Group className="mb-2">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter username"
                          {...register("username")}
                        />
                        {errors.username && (
                          <p className="text-danger">
                            {errors.username.message}
                          </p>
                        )}
                      </Form.Group>

                      {/* Password */}
                      <Form.Group className="mb-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-danger">
                            {errors.password.message}
                          </p>
                        )}
                      </Form.Group>

                      <Button variant="dark" type="submit" className="w-100">
                        Login
                      </Button>
                    </Form>
                  </div>
                </Col>

                {/* Right side: Info */}
                <Col lg={6} className="d-none d-lg-block">
                  <div
                    className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-4 rounded-end"
                    style={{
                      background: "linear-gradient(135deg, #000428, #004e92)",
                    }}
                  >
                    <h5 className="mb-4">Welcome, Admin 👑</h5>
                    <p className="mt-2 mb-5 text-center">
                      Manage users, oversee system activity, and keep everything
                      running smoothly — all in one secure place.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
