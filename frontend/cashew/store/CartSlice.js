import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartAPI from "./cartAPI";

// Helper: get userId from localStorage
const getUserId = () => localStorage.getItem("userId");

// Fetch cart
export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const userId = getUserId();
  if (!userId) throw new Error("User not logged in");
  return await cartAPI.getCart(userId);
});

// Add item to cart
export const addItem = createAsyncThunk(
  "cart/add",
  async ({ productId, name, price, image, quantity }) => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in");
    return await cartAPI.add({ userId, productId, name, price, image, quantity });
  }
);

// Remove cart item
export const removeItem = createAsyncThunk(
  "cart/remove",
  async (id) => await cartAPI.remove(id)
);

// Update quantity
export const updateItemQuantity = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }) => await cartAPI.updateQuantity(id, quantity)
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        const added = action.payload;
        if (!added) return;
        const exists = state.items.find(i => i.productId?.toString() === added.productId?.toString());
        if (exists) exists.quantity = added.quantity;
        else state.items.unshift(added);
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter(i => i._id?.toString() !== id?.toString());
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const idx = state.items.findIndex(i => i._id?.toString() === updated._id?.toString());
        if (idx >= 0) state.items[idx] = updated;
      });
  },
});

export default cartSlice.reducer;
