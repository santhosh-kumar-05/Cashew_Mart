// utils/adminAuth.js
export const isAdminAuthenticated = () => {
  return localStorage.getItem("adminToken") ? true : false;
};
