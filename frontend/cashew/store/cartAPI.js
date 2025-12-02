import API from "../src/axiosConfig";

const cartAPI = {
  // Add item to cart
  add: async ({ userId, productId, name, price, image, quantity }) => {
    if (!userId) throw new Error("User not logged in");
    const res = await API.post("/cart/add", {
      userId,
      productId,
      name,
      price,
      image,
      quantity,
    });
    return res.data.cartItem || res.data;
  },

  // Get cart for a user
  getCart: async (userId) => {
    if (!userId) throw new Error("User not logged in");
    const res = await API.get(`/cart/${userId}`);
    return Array.isArray(res.data) ? res.data : [];
  },

  // Remove cart item by ID
  remove: async (id) => {
    const res = await API.delete(`/cart/${id}`);
    return res.data._id || id;
  },

  // Update cart item quantity
  updateQuantity: async (id, quantity) => {
    const res = await API.put(`/cart/${id}`, { quantity });
    return res.data.cartItem || res.data;
  },
};

export default cartAPI;
