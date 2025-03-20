import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  products: []
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload;
      // Kiểm tra xem sản phẩm đã tồn tại chưa
      const existingIndex = state.products.findIndex(p => p.id === product.id);
      if (existingIndex !== -1) {
        // Nếu đã tồn tại, xóa sản phẩm cũ và thêm vào đầu mảng
        state.products.splice(existingIndex, 1);
      }
      // Thêm sản phẩm mới vào đầu mảng
      state.products.unshift(product);
      // Giới hạn số lượng sản phẩm tối đa là 10
      if (state.products.length > 10) {
        state.products.pop();
      }
    },
    clearRecentlyViewed: (state) => {
      state.products = [];
    },
    loadProductsFromLocalStorage: (state) => {
      const products = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');
      console.log('Loaded products from localStorage:', products);
      state.products = products;
    }
  }
});

// Memoized selector
export const selectRecentlyViewedProducts = createSelector(
  state => state.recentlyViewed.products,
  products => products
);

export const { addProduct, clearRecentlyViewed, loadProductsFromLocalStorage } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer; 