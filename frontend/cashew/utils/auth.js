// utils/auth.js
export const isAuthenticated = () => {
  // Check if userId exists in localStorage
  return localStorage.getItem("userId") ? true : false;
};

export const getUserId = () => {
  return localStorage.getItem("userId") || null;
};
