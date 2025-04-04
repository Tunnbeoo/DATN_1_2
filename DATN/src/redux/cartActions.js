import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      const response = await fetch(`http://localhost:3000/gio-hang/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định từ server' }));
        throw new Error(errorData.message || 'Không thể lấy giỏ hàng');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch Cart Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ userId, productId, quantity, price, discountPrice }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      const response = await fetch(`http://localhost:3000/gio-hang/${userId}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: quantity,
          price: price,
          discountPrice: discountPrice
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định từ server' }));
        throw new Error(errorData.message || 'Không thể cập nhật giỏ hàng');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update Cart Item Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      const response = await fetch(`http://localhost:3000/gio-hang/${userId}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định từ server' }));
        throw new Error(errorData.message || 'Không thể xóa sản phẩm');
      }

      return productId;
    } catch (error) {
      console.error('Remove From Cart Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      const response = await fetch(`http://localhost:3000/gio-hang/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định từ server' }));
        throw new Error(errorData.message || 'Không thể xóa giỏ hàng');
      }

      return userId;
    } catch (error) {
      console.error('Clear Cart Error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, product, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Không tìm thấy token xác thực');

      const cartItemData = {
        id_sp: product.id,
        id_user: userId,
        so_luong: quantity,
        gia: product.gia || 0,
        gia_km: product.gia_km || product.gia || 0
      };

      console.log('Sending Add to Cart Data:', cartItemData);

      const response = await fetch(`http://localhost:3000/gio-hang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartItemData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định từ server' }));
        throw new Error(errorData.message || 'Không thể thêm vào giỏ hàng');
      }

      const data = await response.json();
      console.log('Add to Cart Response:', data);
      return data;
    } catch (error) {
      console.error('Add to Cart Error:', error);
      return rejectWithValue(error.message);
    }
  }
);