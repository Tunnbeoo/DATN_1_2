import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    themSP: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },
    xoaSP: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    capNhatSoLuong: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    }
  }
});

// Memoized selectors
export const selectCartItems = createSelector(
  state => state.cart.items,
  items => items
);

export const selectCartItemCount = createSelector(
  selectCartItems,
  items => items.length
);

export const { themSP, xoaSP, capNhatSoLuong } = cartSlice.actions;
export default cartSlice.reducer; 