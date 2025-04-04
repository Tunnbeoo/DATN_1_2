import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, updateCartItem, removeFromCart, clearCart, addToCart } from './cartActions';

const initialState = {
  listSP: [],
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.listSP = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        const itemIndex = state.listSP.findIndex(item => item.id_sp === updatedItem.id_sp);
        if (itemIndex !== -1) {
          state.listSP[itemIndex] = updatedItem;
        } else {
          console.warn('Item not found in cart state for update:', updatedItem.id_sp);
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.listSP = state.listSP.filter(item => item.id_sp !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.listSP = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const addedOrUpdatedItem = action.payload;
        const itemIndex = state.listSP.findIndex(item => item.id_sp === addedOrUpdatedItem.id_sp);
        if (itemIndex !== -1) {
          state.listSP[itemIndex] = addedOrUpdatedItem;
        } else {
          state.listSP.push(addedOrUpdatedItem);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default cartSlice.reducer;