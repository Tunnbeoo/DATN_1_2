import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from './redux/cartActions';
import './showCart.css';
import logo from './img/logo.png';

function ShowCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listSP, loading, error } = useSelector(state => state.cart);
  const user = useSelector(state => state.auth.user);
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    dispatch(fetchCart(user.id));
  }, [dispatch, user, token, navigate]);

  useEffect(() => {
    if (listSP) {
      // Xử lý dữ liệu từ server để loại bỏ trùng lặp
      const uniqueItems = listSP.reduce((acc, currentItem) => {
        const existingItem = acc.find(item => item.id === currentItem.id);
        if (existingItem) {
          // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
          const newQuantity = Number(existingItem.so_luong) + Number(currentItem.so_luong);
          if (newQuantity > 10) {
            existingItem.so_luong = 10;
            setMessage('Số lượng sản phẩm đã đạt tối đa (10)');
          } else {
            existingItem.so_luong = newQuantity;
          }
          // Cập nhật số lượng trên server
          dispatch(updateCartItem({
            userId: user.id,
            productId: existingItem.id,
            quantity: existingItem.so_luong,
            price: existingItem.gia,
            discountPrice: existingItem.gia_km || existingItem.gia
          }));
          // Xóa bản sao
          dispatch(removeFromCart({
            userId: user.id,
            productId: currentItem.id
          }));
        } else {
          acc.push({...currentItem});
        }
        return acc;
      }, []);

      setCartItems(uniqueItems);
      const initialSelected = uniqueItems.reduce((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {});
      setSelectedItems(initialSelected);
      calculateAndSetTotal([]);
    }
  }, [listSP, dispatch, user.id]);

  const calculateAndSetTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = Number(item.gia_km) || Number(item.gia) || 0;
      const quantity = Number(item.so_luong) || 0;
      return sum + (price * quantity);
    }, 0);
    setTotalPrice(total);
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => {
      const newSelected = { ...prev, [productId]: !prev[productId] };
      
      // Tính toán lại tổng tiền dựa trên các sản phẩm được chọn
      const selectedProducts = cartItems.filter(item => newSelected[item.id]);
      calculateAndSetTotal(selectedProducts);
      
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedItems).every(Boolean);
    const newSelected = cartItems.reduce((acc, item) => {
      acc[item.id] = !allSelected;
      return acc;
    }, {});
    setSelectedItems(newSelected);
    
    // Tính toán lại tổng tiền
    const selectedProducts = allSelected ? [] : cartItems;
    calculateAndSetTotal(selectedProducts);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const product = cartItems.find(item => item.id === productId);
      if (!product) return;

      if (newQuantity < 1 || newQuantity > 10) {
        setMessage('Số lượng phải từ 1 đến 10');
        return;
      }

      // Gọi action cập nhật số lượng
      await dispatch(updateCartItem({
        userId: user.id,
        productId: productId,
        quantity: newQuantity,
        price: product.gia,
        discountPrice: product.gia_km || product.gia
      }));

      // Cập nhật UI từ Redux store
      const updatedItems = listSP.map(item => 
        item.id === productId 
          ? { ...item, so_luong: newQuantity }
          : item
      );
      setCartItems(updatedItems);
      
      // Tính lại tổng tiền cho các sản phẩm được chọn
      const selectedProducts = updatedItems.filter(item => selectedItems[item.id]);
      calculateAndSetTotal(selectedProducts);

      setMessage('Cập nhật số lượng thành công');
    } catch (error) {
      setMessage('Lỗi khi cập nhật số lượng');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      // Xóa sản phẩm khỏi server
      await dispatch(removeFromCart({ 
        userId: user.id, 
        productId: productId 
      }));

      // Cập nhật lại giỏ hàng từ server
      const response = await dispatch(fetchCart(user.id));
      
      if (response.payload) {
        // Cập nhật state với dữ liệu mới từ server
        setCartItems(response.payload);
        const initialSelected = response.payload.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {});
        setSelectedItems(initialSelected);
        calculateAndSetTotal([]);
      }

      setMessage('Đã xóa sản phẩm thành công');
    } catch (error) {
      setMessage('Lỗi khi xóa sản phẩm');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      try {
        // Xóa toàn bộ giỏ hàng trên server
        await dispatch(clearCart(user.id));
        
        // Reset local state
        setCartItems([]);
        setSelectedItems({});
        setTotalPrice(0);

        // Cập nhật lại giỏ hàng từ server
        await dispatch(fetchCart(user.id));

        setMessage('Đã xóa toàn bộ giỏ hàng');
      } catch (error) {
        setMessage('Lỗi khi xóa giỏ hàng');
      }
    }
  };

  const handleCheckout = () => {
    if (totalPrice === 0) {
      setMessage('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }

    // Lọc ra các sản phẩm đã chọn
    const selectedProducts = cartItems.filter(item => selectedItems[item.id]);

    // Cập nhật giỏ hàng trong Redux store chỉ với các sản phẩm đã chọn
    dispatch({ 
      type: 'cart/updateSelectedItems', 
      payload: selectedProducts 
    });

    // Chuyển hướng đến trang thanh toán
    navigate('/thanh-toan');
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Giỏ Hàng Của Bạn</h1>
      </div>

      {message && <div className="message">{message}</div>}

      {(!cartItems || cartItems.length === 0) ? (
        <div className="empty-cart">
          <p>Giỏ hàng của bạn đang trống</p>
          <Link to="/" className="continue-shopping">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="select-all">
              <label>
                <input
                  type="checkbox"
                  checked={Object.values(selectedItems).every(Boolean)}
                  onChange={handleSelectAll}
                />
                Chọn tất cả
              </label>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems[item.id] || false}
                    onChange={() => handleSelectItem(item.id)}
                  />
                </div>
                <div className="item-image">
                  {item.hinh_anh && <img src={item.hinh_anh} alt={item.ten_sp} />}
                </div>
                <div className="item-details">
                  <h3>{item.ten_sp}</h3>
                  <div className="price">
                    {item.gia_km ? (
                      <>
                        <span className="original-price">{Number(item.gia).toLocaleString()}đ</span>
                        <span className="discount-price">{Number(item.gia_km).toLocaleString()}đ</span>
                      </>
                    ) : (
                      <span>{Number(item.gia).toLocaleString()}đ</span>
                    )}
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.id, Number(item.so_luong) - 1)}
                            disabled={Number(item.so_luong) <= 1}>
                      -
                    </button>
                    <span>{item.so_luong}</span>
                    <button onClick={() => handleQuantityChange(item.id, Number(item.so_luong) + 1)}
                            disabled={Number(item.so_luong) >= 10}>
                      +
                    </button>
                  </div>
                  <button className="remove-item" onClick={() => handleRemoveItem(item.id)}>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="total">
              <h3>Tổng tiền:</h3>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div className="cart-actions">
              <button className="clear-cart" onClick={handleClearCart}>
                Xóa giỏ hàng
              </button>
              <button 
                className={`checkout-btn ${totalPrice === 0 ? 'disabled' : ''}`}
                onClick={handleCheckout}
                disabled={totalPrice === 0}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ShowCart; 