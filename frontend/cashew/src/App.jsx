import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Product from "../userpage/Product";
import Login from "../authpages/Login";
import UserLogin from "../userauthpage/UserLogin";
import Register from "../userauthpage/Register";

import AdminDashboard from "../Adminpage/AdminDashboard";
import AdminProductPage from "../Adminpage/AdminProductPage";
import AddProduct from "../Adminpage/AddProduct";
import AdminUpdateProduct from "../Adminpage/AdminUpdateProduct";

import AllUserProduct from "../userpage/AllUserProduct";
import ProductDetails from "../userpage/ProductDetails";
import Cartt from "../userpage/Cart";
import Shiping from "../userpage/Shiping";
import ConfirmOrder from "../userpage/ConfirmOrder";
import PaymentSuccess from "../userpage/PaymentSuccess";
import MyOrders from "../userpage/MyOrders";

import NotFound from "../components/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import RedirectAuthRoute from "../components/RedirectAuthRoute";
import AdminProtectedRoute from "../components/AdminProtectedRoute";
import AdminRedirectRoute from "../components/AdminRedirectRoute";

import UserLayout from "../components/UserLayout"; // Added

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ADMIN LOGIN */}
        <Route
          path="/adminlogin"
          element={
            <AdminRedirectRoute>
              <Login />
            </AdminRedirectRoute>
          }
        />

        {/* USER LOGIN / REGISTER */}
        <Route
          path="/userlogin"
          element={
            <RedirectAuthRoute>
              <UserLogin />
            </RedirectAuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <UserLayout>
              <RedirectAuthRoute>
                <Register />
              </RedirectAuthRoute>
            </UserLayout>
          }
        />

        {/* PUBLIC USER PAGES WITH FOOTER */}
        <Route path="/" element={<Product />} />
        <Route
          path="/allproducts"
          element={
            <UserLayout>
              <AllUserProduct />
            </UserLayout>
          }
        />
        <Route
          path="/productdeatils/:id"
          element={
            <UserLayout>
              <ProductDetails />
            </UserLayout>
          }
        />

        {/* USER PROTECTED ROUTES */}
        <Route
          path="/cart"
          element={
            <UserLayout>
              <ProtectedRoute>
                <Cartt />
              </ProtectedRoute>
            </UserLayout>
          }
        />
        <Route
          path="/shiping/:id"
          element={
            <UserLayout>
              <ProtectedRoute>
                <Shiping />
              </ProtectedRoute>
            </UserLayout>
          }
        />
        <Route
          path="/confrimorder/:id"
          element={
            <UserLayout>
              <ProtectedRoute>
                <ConfirmOrder />
              </ProtectedRoute>
            </UserLayout>
          }
        />
        <Route
          path="/paymentsuccess"
          element={
            <UserLayout>
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            </UserLayout>
          }
        />
        <Route
          path="/myorder"
          element={
            <UserLayout>
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            </UserLayout>
          }
        />

        {/* ADMIN PAGES WITHOUT FOOTER */}
        <Route
          path="/admindashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminproduct"
          element={
            <AdminProtectedRoute>
              <AdminProductPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/addproduct"
          element={
            <AdminProtectedRoute>
              <AddProduct />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/updateproduct/:id"
          element={
            <AdminProtectedRoute>
              <AdminUpdateProduct />
            </AdminProtectedRoute>
          }
        />

        {/* NOT FOUND */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
