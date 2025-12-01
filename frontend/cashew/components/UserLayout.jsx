import React from "react";

const UserLayout = ({ children }) => {
  return (
    <>
      {children}
      <footer className="footer-text">
        © 2025 Cashew Delights • All Rights Reserved
      </footer>
    </>
  );
};

export default UserLayout;
