import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import API from "../src/axiosConfig"; 
import "../public/AdminLogin.css";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  
  // ✅ State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/admin/login", data);

      if (res.data.message === "Login Successful") {
        Swal.fire({
          title: "Admin Login Successful 🎉",
          text: `Welcome, ${data.username}!`,
          icon: "success",
        });

        localStorage.setItem("adminToken", res.data.token);
        navigate("/admindashboard");
        return;
      }

      Swal.fire({
        title: "Invalid Credentials ❌",
        text: "Please check your username and password",
        icon: "error",
      });
    } catch (err) {
      Swal.fire({
        title: "Server Error",
        text: err.response?.data?.message || err.message,
        icon: "error",
      });
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mob" style={{ height: "300px", marginTop: "100px" }}>
        <Col xl={10}>
          <Card className="border-0 shadow adminlogin" style={{ width: "700px", height: "400px", marginLeft: "100px", marginBottom: "200px" }}>
            <Card.Body className="adimcard">
              <Row>
                <Col lg={6}>
                  <div className="p-3">
                    <h3 className="h4 fw-bold text-primary mt-3 text-center">Admin Login Portal</h3>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group className="mb-2">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" {...register("username")} />
                        {errors.username && <p className="text-danger">{errors.username.message}</p>}
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Password</Form.Label>
                        {/* ✅ InputGroup for hide/show */}
                        <InputGroup>
                          <Form.Control 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            {...register("password")} 
                          />
                          <Button 
                            variant="outline-secondary" 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputGroup>
                        {errors.password && <p className="text-danger">{errors.password.message}</p>}
                      </Form.Group>

                      <Button variant="dark" type="submit" className="w-100">Login</Button>
                    </Form>
                  </div>
                </Col>

                <Col lg={6} className="d-none d-lg-block">
                  <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-4 rounded-end" style={{ background: "linear-gradient(135deg, #000428, #004e92)" }}>
                    <h5 className="mb-4">Welcome, Admin 👑</h5>
                    <p className="mt-2 mb-5 text-center">Manage users and system securely.</p>
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
