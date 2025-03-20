import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import compareReducer from './compareSlice';
import recentlyViewedReducer from './recentlyViewedSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    compare: compareReducer,
    recentlyViewed: recentlyViewedReducer
  }
}); 