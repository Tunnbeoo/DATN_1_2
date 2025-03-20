import { configureStore } from "@reduxjs/toolkit";
import compareReducer from "./compareSlice";  
import authReducer from "./authSlice";  
import cartReducer from "./cartSlice";  
import recentlyViewedReducer from "./recentlyViewedSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        compare: compareReducer,
        recentlyViewed: recentlyViewedReducer,
    },
});

export default store;
