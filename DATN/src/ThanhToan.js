import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { xoaGH } from "./cartSlice";
import { useNavigate } from "react-router-dom";
import "./ThanhToan.css";

function ThanhToan() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    dien_thoai: "",
    dia_chi: "",
  });
  const cart = useSelector((state) => state.cart.listSP);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(cart);
  // console.log(cart);
  const totalAmount = cart.reduce(
    (total, sp) => total + (sp.gia_km ?? sp.gia ?? 0) * sp.so_luong,
    0
  );
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod hoặc banking

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      alert("Không tìm thấy userId hoặc token, vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Lỗi ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data.id) setUser(data);
        else alert("Không tìm thấy thông tin người dùng!");
      })
      .catch((error) => {
        console.error("Lỗi tải thông tin user:", error);
        alert("Có lỗi khi tải thông tin user, vui lòng thử lại!");
        navigate("/login");
      });
  }, [navigate]);
  const token = localStorage.getItem("token");
  const submitDuLieu = () => {
    if (!user) {
      alert("Thông tin user bị thiếu!");
      return;
    }

    const userId = localStorage.getItem("userId");

    let url = "http://localhost:3000/luudonhang";
    let tt = {
      id_user: userId, // Giữ nguyên id_user
      ho_ten: user.name,
      email: user.email,
      sdt: user.dien_thoai,
      dia_chi: user.dia_chi,
      tong_tien: totalAmount,
      hinh_thuc_tt: paymentMethod === "banking" ? "Banking" : "COD",
      trang_thai: "Pending",
    };

    let opt = {
      method: "POST",
      body: JSON.stringify(tt),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    fetch(url, opt)
      .then((res) => res.json())
      .then((data) => {
        if (data.id_dh < 0) {
          console.log("Lỗi lưu đơn hàng", data);
          alert("Lỗi khi lưu đơn hàng!");
        } else {
          let id_dh = data.id_dh;
          luuchitietdonhang(id_dh, cart);

          if (paymentMethod === "banking") {
            navigate(`/payment/${id_dh}/${totalAmount}`);
          } else {
            navigate("/thanks");
          }
        }
      })
      .catch((error) => {
        console.error("Lỗi đặt hàng:", error);
        alert("Có lỗi xảy ra khi đặt hàng!");
      });
  };

  const luuchitietdonhang = (id_dh, cart) => {
    let url = "http://localhost:3000/luugiohang";
    cart.forEach((sp) => {
      let t = {
        id_dh: id_dh,
        id_sp: sp.id,
        so_luong: sp.so_luong,
        gia: sp.gia,
      };
      let opt = {
        method: "POST",
        body: JSON.stringify(t),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      fetch(url, opt)
        .then((res) => res.json())
        .then(() => dispatch(xoaGH(sp.id)))
        .catch((err) => console.log("Lỗi lưu SP", sp));
    });
  };

  const handleEdit = () => {
    setEditedInfo({
      dien_thoai: user.dien_thoai,
      dia_chi: user.dia_chi,
    });
    setEditMode(true);
  };

  const handleSave = () => {
    setUser({
      ...user,
      dien_thoai: editedInfo.dien_thoai,
      dia_chi: editedInfo.dia_chi,
    });
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="box_tong_TT">
      <h2>Thông tin Thanh Toán</h2>

      <div className="customer-info">
        <p>
          <strong>Họ tên:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        {editMode ? (
          <>
            <div className="edit-field">
              <strong>Số điện thoại:</strong>
              <input
                type="text"
                value={editedInfo.dien_thoai}
                onChange={(e) =>
                  setEditedInfo({ ...editedInfo, dien_thoai: e.target.value })
                }
                className="edit-input"
              />
            </div>
            <div className="edit-field">
              <strong>Địa chỉ:</strong>
              <input
                type="text"
                value={editedInfo.dia_chi}
                onChange={(e) =>
                  setEditedInfo({ ...editedInfo, dia_chi: e.target.value })
                }
                className="edit-input"
              />
            </div>
            <div className="edit-buttons">
              <button onClick={handleSave} className="save-btn">
                Lưu
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Hủy
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Số điện thoại:</strong> {user.dien_thoai}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {user.dia_chi}
            </p>
            <button onClick={handleEdit} className="edit-btn">
              Sửa thông tin
            </button>
          </>
        )}
      </div>

      <div className="total-amount">
        <strong>Tổng tiền:</strong> {totalAmount.toLocaleString()} VND
      </div>

      <h3>Giỏ hàng của bạn</h3>
      <table>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((sp, index) => (
            <tr key={index}>
              <td>{sp.ten_sp}</td>
              <td>{((sp.gia_km ?? sp.gia ?? 0) || 0).toLocaleString()} VND</td>

              <td>{sp.so_luong}</td>
              <td>
                {((sp.gia_km ?? sp.gia ?? 0) * sp.so_luong).toLocaleString()}{" "}
                VND
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="payment-methods">
        <h3>Phương thức thanh toán</h3>
        <div className="payment-options">
          <div
            className={`payment-option ${
              paymentMethod === "cod" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            <div className="payment-icon">
              <i className="fas fa-truck"></i>
            </div>
            <div className="payment-details">
              <h4>Thanh toán khi nhận hàng</h4>
              <p>Thanh toán bằng tiền mặt khi nhận được hàng</p>
            </div>
          </div>

          <div
            className={`payment-option ${
              paymentMethod === "banking" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("banking")}
          >
            <div className="payment-icon">
              <i className="fas fa-university"></i>
            </div>
            <div className="payment-details">
              <h4>Thanh toán qua ngân hàng</h4>
              <p>Chuyển khoản qua QR code</p>
            </div>
          </div>
        </div>
      </div>

      <button className="button_TT" onClick={submitDuLieu}>
        {paymentMethod === "banking" ? "Thanh toán qua ngân hàng" : "Đặt hàng"}
      </button>
    </div>
  );
}

export default ThanhToan;
