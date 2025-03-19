import { createSlice } from "@reduxjs/toolkit";

// Khai báo initialState để dễ bảo trì
const initialState = {
  daDangNhap: false,
  user: null,
  token: null,
  expiresIn: 0,
};

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    thoat: (state) => {
      Object.assign(state, initialState); // Reset toàn bộ state khi logout
      console.log("Người dùng đã đăng xuất.");
    },
    dalogin: (state, action) => {
      const { token, expiresIn, userInfo } = action.payload || {};

      if (!token || !userInfo) {
        console.error("Lỗi đăng nhập: Thiếu thông tin từ server!");
        return;
      }

      state.token = token;
      state.expiresIn = expiresIn || 0; // Tránh undefined
      state.user = userInfo;
      state.daDangNhap = true;

      console.log("✅ Đã ghi nhận state đăng nhập:", state.user);
    },
  },
});

export const { dalogin, thoat } = authSlice.actions;
export default authSlice.reducer;
