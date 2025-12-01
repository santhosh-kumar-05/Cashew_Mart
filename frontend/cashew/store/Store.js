import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice";
import ShipingCart from "./ShipingSlice";

const reducer = combineReducers({
  cart: cartReducer,
  Shiping: ShipingCart,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
