import { useDispatch, useSelector } from "react-redux";
import { suaSL, xoaSP } from "./cartSlice";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./showCart.css";

function ShowCart(props) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.listSP);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.gia * item.so_luong, 0);
  };

  return (
    <div id="giohang" style={{ width: "50%", display: "block", margin: "auto", paddingTop: "1px" }}>
      <h2>
        <i className="bi bi-caret-right-fill"></i> Giỏ hàng ({cart.length} sản phẩm)
      </h2>
      <div className="ShowCart">
        <div className="cart-items">
          {cart.map((sp, index) => (
            <div className="cart-item" key={index}>
              <input
                type="checkbox"
                checked={selectedItems.includes(sp.id)}
                onChange={() => handleCheckboxChange(sp.id)}
              />
              <img src={sp.hinh} alt={sp.ten_sp} className="item-image" />
              <div className="item-details">
                <div className="item-name">{sp.ten_sp.toLocaleUpperCase()}</div>
                <div className="item-price">
                  {Number(sp.gia).toLocaleString("vi")} VNĐ
                </div>
                <div className="item-status">Tình Trạng: còn hàng</div>
              </div>
              <div className="item-quantity">
                <button
                  onClick={() => {
                    if (sp.so_luong > 1) {
                      dispatch(suaSL([sp.id, sp.so_luong - 1]));
                    }
                  }}
                >
                  -
                </button>
                <span>{sp.so_luong}</span>
                <button onClick={() => dispatch(suaSL([sp.id, sp.so_luong + 1]))}>
                  +
                </button>
              </div>
              <button
                className="remove-item"
                onClick={() => dispatch(xoaSP(sp.id))}
              >
                <button type="button" className="btn btn-outline-danger">Xóa</button>
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="payment">
            <div className="payment-header">Thanh Toán</div>
            <div className="payment-row">
              <span>Tổng giá trị thanh toán</span>
              <span>{Number(calculateTotal()).toLocaleString("vi")}₫</span>
            </div>
            <Link to="/thanhtoan" state={{ selectedItems }}>
              <button className="login-payment" disabled={selectedItems.length === 0}>
                Thanh Toán
              </button>
            </Link>
            <button className="mobile-banking">
              Mua siêu tốc qua Mobile Banking
            </button>
            <div>
            <button className="momo-payment">
              <img src="https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0" alt="    " />
              Mua siêu tốc với MOMO
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowCart;
