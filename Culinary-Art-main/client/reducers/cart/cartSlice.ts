"use client";

import { CartInfoState, GlobalStoreState } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CartInfoState = {
  cart: {
    items: [],
    deliveryCharge: 60,
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const existingItem = state.cart.items.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;

        return;
      }

      state.cart.items.push(action.payload);
    },

    increaseItemQuantity(state, action) {
      const existingItem = state.cart.items.find(
        (item) => item._id === action.payload
      );

      if (existingItem) {
        existingItem.quantity += 1;
      }
    },

    decreaseItemQuantity(state, action) {
      const existingItem = state.cart.items.find(
        (item) => item._id === action.payload
      );

      if (existingItem && existingItem.quantity === 1) {
        state.cart.items = state.cart.items.filter(
          (item) => item._id !== existingItem._id
        );
      }

      if (existingItem) {
        existingItem.quantity -= 1;
      }
    },

    deleteItem(state, action) {
      const existingItem = state.cart.items.find(
        (item) => item._id === action.payload
      );

      if (existingItem) {
        state.cart.items = state.cart.items.filter(
          (item) => item._id !== action.payload
        );
      }
    },

    clearCart(state) {
      state.cart.items = [];
    },
  },
});

export const {
  addItem,
  deleteItem,
  clearCart,
  decreaseItemQuantity,
  increaseItemQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;

export const getCart = (state: GlobalStoreState) => state.cart.cart;
export const getCartItems = (state: GlobalStoreState) => state.cart.cart.items;

export const getCartItemIds = (state: GlobalStoreState) =>
  state.cart.cart.items.map((item) => item._id);

export const getTotalCartQuantity = (state: GlobalStoreState) =>
  state.cart.cart.items.reduce((acc, item) => acc + item.quantity, 0);

export const getCurrentQuantityById = (id: string) => {
  return (state: GlobalStoreState) =>
    state.cart.cart.items.find((item) => item._id === id)?.quantity ?? 0;
};

export const getTotalCartPrice = (state: GlobalStoreState) =>
  state.cart.cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

export const getCurrentDeliveryCharge = (state: GlobalStoreState) =>
  state.cart.cart.deliveryCharge;

export const getSubtotalCartPrice = (state: GlobalStoreState) =>
  state.cart.cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

export const getTotalOrderPrice = (state: GlobalStoreState) => {
  const subtotal = getSubtotalCartPrice(state);
  const delivery = getCurrentDeliveryCharge(state);
  return subtotal + delivery;
};
