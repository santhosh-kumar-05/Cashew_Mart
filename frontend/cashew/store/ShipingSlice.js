import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

const shipingSlice = createSlice({
  name: "Shiping",
  initialState,
  reducers: {
    saveShipingInfo(state, action) {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },
  },
});

export const { saveShipingInfo } = shipingSlice.actions;
export default shipingSlice.reducer;
