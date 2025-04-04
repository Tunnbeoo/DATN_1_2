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

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    dispatch(fetchCart(user.id));
  }, [dispatch, user, token, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    console.log('handleQuantityChange called with:');
    console.log('productId:', productId);
    console.log('newQuantity:', newQuantity);
    console.log('Current listSP state:', listSP);

    if (!user || !user.id) {
      setMessage('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }
    if (newQuantity < 1 || newQuantity > 10) {
      setMessage('Số lượng phải từ 1 đến 10');
      return;
    }

    try {
      console.log(`Finding product with productId: ${productId} (Type: ${typeof productId})`);
      const product = listSP.find((item, index) => {
        const currentItemId = item.id;
        const currentItemIdParsed = parseInt(currentItemId);
        const targetProductIdParsed = parseInt(productId);
        const areEqual = currentItemIdParsed === targetProductIdParsed;

        console.log(`  [Item ${index}] id: ${currentItemId} (Type: ${typeof currentItemId}) -> Parsed: ${currentItemIdParsed}`);
        console.log(`  [Item ${index}] Comparing with productId: ${productId} -> Parsed: ${targetProductIdParsed}`);
        console.log(`  [Item ${index}] Are equal (===)?: ${areEqual}`);
        
        return areEqual; 
      }); 
      console.log('Final product found in listSP:', product);

      if (!product) {
        setMessage('Không tìm thấy sản phẩm trong state listSP (dùng item.id - check console)');
        return;
      }

      await dispatch(updateCartItem({
        userId: user.id,
        productId,
        quantity: newQuantity,
        price: product.gia || 0,
        discountPrice: product.gia_km || 0
      })).unwrap();

      setMessage('Cập nhật số lượng thành công');
    } catch (error) {
      const errorMessage = error.message || 'Lỗi không xác định';
      setMessage(`Cập nhật số lượng thất bại: ${errorMessage}`);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!user || !user.id) {
      setMessage('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await dispatch(removeFromCart({ userId: user.id, productId })).unwrap();
        setMessage('Đã xóa sản phẩm thành công');
      } catch (error) {
        const errorMessage = error.message || 'Lỗi không xác định';
        setMessage(`Xóa sản phẩm thất bại: ${errorMessage}`);
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      try {
        await dispatch(clearCart(user.id)).unwrap();
        setMessage('Đã xóa toàn bộ giỏ hàng');
      } catch (error) {
        setMessage('Xóa giỏ hàng thất bại: ' + error.message);
      }
    }
  };

  const calculateTotal = () => {
    return listSP.reduce((total, item) => {
      const price = item.gia_km || item.gia || 0;
      return total + price * item.so_luong;
    }, 0);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!token || !user) return null;
  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Giỏ hàng của bạn</h1>
      </div>

      {message && (
        <div className="message" style={{
          padding: '10px',
          margin: '10px 0',
          backgroundColor: message.includes('thất bại') ? '#ffebee' : '#e8f5e9',
          color: message.includes('thất bại') ? '#c62828' : '#2e7d32',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}

      {listSP.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <p>Giỏ hàng của bạn đang trống</p>
          <p className="empty-cart-subtitle">Hãy chọn thêm sản phẩm để mua sắm nhé</p>
          <Link to="/" className="continue-shopping">Quay lại trang chủ</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-table">
              <div className="cart-table-header">
                <div className="col-product">Sản phẩm</div>
                <div className="col-price">Đơn giá</div>
                <div className="col-quantity">Số lượng</div>
                <div className="col-total">Thành tiền</div>
                <div className="col-action">Thao tác</div>
              </div>
              {listSP.map((item, index) => {
                console.log(`[Item ${index} in map]:`, item);
                const price = item.gia_km || item.gia || 0;
                const originalPrice = item.gia || 0;
                const hasDiscount = item.gia_km;
                const total = price * item.so_luong;
                const productId = item.id_sp || item.id;
                console.log(`[Item ${index} in map] Calculated productId:`, productId);

                return (
                  <div key={`${item.id_user}-${productId}`} className="cart-table-row">
                    <div className="col-product">
                      <div className="product-info">
                        <img
                          src={item.hinh || logo}
                          alt={item.ten_sp}
                          className="product-image"
                          onError={(e) => { e.target.src = logo; }}
                        />
                        <div className="product-details">
                          <h3>{item.ten_sp}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-price">
                      <div className="price-info">
                        <span className="price">{price.toLocaleString()} VND</span>
                        {hasDiscount && (
                          <span className="original-price">{originalPrice.toLocaleString()} VND</span>
                        )}
                      </div>
                    </div>
                    <div className="col-quantity">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleQuantityChange(productId, item.so_luong - 1)}
                          className="quantity-btn"
                          disabled={item.so_luong <= 1}
                        >-</button>
                        <span className="quantity">{item.so_luong}</span>
                        <button
                          onClick={() => handleQuantityChange(productId, item.so_luong + 1)}
                          className="quantity-btn"
                          disabled={item.so_luong >= 10}
                        >+</button>
                      </div>
                    </div>
                    <div className="col-total">
                      <span className="total-price">{total.toLocaleString()} VND</span>
                    </div>
                    <div className="col-action">
                      <button
                        onClick={() => handleRemoveItem(productId)}
                        className="remove-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="cart-summary">
            <div className="summary-header">
              <h3>Tổng đơn hàng</h3>
            </div>
            <div className="summary-content">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{calculateTotal().toLocaleString()} VND</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{calculateTotal().toLocaleString()} VND</span>
              </div>
            </div>
            <div className="summary-actions">
              <button onClick={handleClearCart} className="clear-cart-btn">Xóa giỏ hàng</button>
              <Link to="/thanh-toan" className="checkout-btn">Thanh toán</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowCart;