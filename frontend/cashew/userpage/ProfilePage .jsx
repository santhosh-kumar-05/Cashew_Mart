import React, { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import axios from "axios";
import UserNav from "./UserNav";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      Swal.fire({
        title: "Not logged in",
        text: "Please login first",
        icon: "warning",
      });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
        if (res.data.status) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || err.message,
          icon: "error",
        });
      }
    };

    fetchProfile();
  }, [userId]);

  if (!user) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading profile...</h2>;

  return (
    <section>
      <UserNav />
      <Container style={{ marginTop: "50px" }}>
        <Card className="p-4 shadow" style={{ maxWidth: "600px", margin: "auto" }}>
          <h3 className="mb-3">Profile</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          {user.avatar && <img src={user.avatar} alt="Avatar" style={{ width: "120px", borderRadius: "50%" }} />}
        </Card>
      </Container>
    </section>
  );
};

export default ProfilePage;
