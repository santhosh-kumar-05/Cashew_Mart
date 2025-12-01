import React, { useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "../public/Home.css";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });

    // NAVBAR SCROLL EFFECT
    const handleScroll = () => {
      const navbar = document.querySelector(".navv");
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");  // Add scroll class
      } else {
        navbar.classList.remove("scrolled"); // Remove scroll class
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="homepage-wrapper">

      <Navbar bg="transparent" expand="lg" className="px-4 navv">
        <Container fluid className="d-flex justify-content-between">
          <Navbar.Brand
            className="text-white fw-bold fs-3"
            data-aos="fade-down"
            style={{ marginLeft: "30px" }}
          >
            CASHEW DELIGHTS
          </Navbar.Brand>

          <Nav className="ms-auto d-flex align-items-center gap-2">
            <Button
              variant="light"
              className="px-3"
              data-aos="fade-left"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </Button>

            <Button
              variant="light"
              className="px-3"
              data-aos="fade-left"
              onClick={() => navigate("/userlogin")}
            >
              User Login
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* HERO SECTION */}
      <section className="home">
        <Container fluid className="hero-container">
          <div className="hero-content text-white" data-aos="fade-up">
            <h1 className="fw-bold display-4">Premium Cashew Products</h1>

            <p className="lead mt-3" data-aos="fade-right">
              Taste the richness of handpicked, high-quality cashews — naturally
              fresh and delicious.
            </p>

            <p className="mt-2" data-aos="fade-left">
              From crunchy roasted cashews to organic varieties, our products
              bring you the finest quality directly from farms to your table.
              Perfect for gifting, snacking, and celebrations.
            </p>

            <Button
              variant="light"
              size="lg"
              className="mt-3"
              data-aos="zoom-in"
              onClick={() => navigate("/products")}
            >
              Explore Products
            </Button>
          </div>
        </Container>
      </section>

      {/* FOOTER ALWAYS AT BOTTOM */}
      <Footer />
    </div>
  );
};

export default Homepage;
