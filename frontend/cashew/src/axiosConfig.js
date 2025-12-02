import axios from "axios";

const API = axios.create({
  baseURL: "https://cashewmart.onrender.com/api",
});

export default API;
