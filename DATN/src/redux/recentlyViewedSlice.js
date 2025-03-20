import { createSlice, createSelector } from '@reduxjs/toolkit';

// Lấy dữ liệu từ localStorage nếu có
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('recentlyViewed');
    if (serializedState === null) {
      return { products: [] };
    }
    const parsedState = JSON.parse(serializedState);
    // Ensure the state has the correct structure
    if (!parsedState || !Array.isArray(parsedState.products)) {
      return { products: [] };
    }
    return parsedState;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return { products: [] };
  }
};

const initialState = loadState();

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addToRecentlyViewed: (state, action) => {
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
      // Lưu vào localStorage
      try {
        const serializedState = JSON.stringify({ products: state.products });
        localStorage.setItem('recentlyViewed', serializedState);
      } catch (err) {
        console.error('Error saving state to localStorage:', err);
      }
    },
    clearRecentlyViewed: (state) => {
      state.products = [];
      // Xóa khỏi localStorage
      try {
        localStorage.removeItem('recentlyViewed');
      } catch (err) {
        console.error('Error removing state from localStorage:', err);
      }
    }
  }
});

// Memoized selector với transformation logic
export const selectRecentlyViewedProducts = createSelector(
  state => state.recentlyViewed.products,
  products => {
    // Transform dữ liệu nếu cần
    return products.map(product => ({
      ...product,
      // Đảm bảo các trường cần thiết luôn tồn tại
      id: product.id || '',
      tensp: product.tensp || product.ten_sp || '',
      hinh: product.hinh || '',
      gia: product.gia || product.gia_km || 0,
      id_loai: product.id_loai || ''
    }));
  }
);

export const { addToRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer; 