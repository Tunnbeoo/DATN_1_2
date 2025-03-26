import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import authSlice from "./authSlice";
import compareSlice from "./compareSlice"; // import compareReducer

export const store = configureStore({
    reducer:{ 
        cart: cartSlice,
        auth: authSlice,
        compare: compareSlice  // thêm compareReducer vào store
    },
})