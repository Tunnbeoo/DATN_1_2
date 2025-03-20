import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  danhSachSoSanh: []
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const newItem = action.payload;
      if (!state.danhSachSoSanh.find(item => item.id === newItem.id)) {
        state.danhSachSoSanh.push(newItem);
      }
    },
    removeFromCompare: (state, action) => {
      state.danhSachSoSanh = state.danhSachSoSanh.filter(item => item.id !== action.payload);
    },
    clearCompare: (state) => {
      state.danhSachSoSanh = [];
    }
  }
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer; 