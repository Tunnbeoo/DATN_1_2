import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./Profile.css";
import { thoat } from "./authSlice";
import { setUser } from "./userSlice";

function Profile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setLocalUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("Lỗi: Không tìm thấy userId từ URL!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập lại");
      dispatch(thoat());
      navigate("/auth");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
          dispatch(thoat());
          navigate("/auth");
          return;
        }

        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status} - Không tìm thấy user`);
        }

        const data = await response.json();
        setLocalUser(data);
        setEditedUser(data);
        dispatch(setUser(data));
      } catch (err) {
        console.error("Lỗi fetch:", err.message);
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch, navigate]);

  // Hàm xử lý khi nhập dữ liệu vào form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  // Hàm cập nhật thông tin người dùng
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại");
        dispatch(thoat());
        navigate("/auth");
        return;
      }

      const response = await fetch(`http://localhost:3000/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editedUser),
      });

      if (response.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        dispatch(thoat());
        navigate("/auth");
        return;
      }

      if (!response.ok) {
        throw new Error("Cập nhật thất bại!");
      }

      const updatedUser = await response.json();
      setLocalUser(updatedUser);
      dispatch(setUser(updatedUser));
      setSuccessMessage("Cập nhật thành công!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Cập nhật thất bại. Vui lòng thử lại!");
      console.error(err);
    }
  };

  // Hàm đăng xuất
  const Logout = () => {
    if (window.confirm("Bạn muốn đăng xuất?")) {
      dispatch(thoat());
      navigate("/");
    }
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="profile-container">
      <div className="profile-left">
      <div className="profile-header">Thông tin tài khoản</div>
        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Tên đăng nhập</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Họ và tên</span>
            <span className="info-value">{user.name}</span>
          </div>
          {/* Thêm các trường thông tin khác nếu cần */}
        </div>   
        {successMessage && <p className="success-message">{successMessage}</p>}
        {error && <p className="error-message">{error}</p>}
        
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input type="text" id="name" name="name" value={editedUser.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Điện thoại</label>
            <input type="text" id="phone" name="dien_thoai" value={editedUser.dien_thoai} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={editedUser.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="dia_chi">Địa chỉ</label>
            <input type="text" id="dia_chi" name="dia_chi" value={editedUser.dia_chi} onChange={handleChange} />
          </div>
          <button className="update-button" onClick={handleUpdate}>CẬP NHẬT THÔNG TIN</button>
        </div>
        <div className="profile-header">Cập nhật ảnh đại diện</div>
        <div className="profile-avatar-upload">
          <button>Tải ảnh</button>
          <span>Không có tập nào được chọn</span>
          <img src={`http://localhost:3000/uploads/${user.hinh}`} alt="" width="150" />
        </div>
      </div>

      <div className="profile-right">
        <div className="profile-card">
          <img src={`http://localhost:3000/uploads/${user.hinh}`} alt="" width="150" />
          <h2>{user.name}</h2>
        </div>
        <ul className="profile-menu">
          <li>Thông tin tài khoản</li>
          <li>Lịch sử đơn hàng</li>
          <li>Lịch sử giao dịch</li>
          <li>Mật khẩu và bảo mật</li>
          <li>Bình luận của tôi</li>
          <li>Sản phẩm yêu thích</li>
          <li>
            <button className="logout" onClick={Logout}>Đăng xuất</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Profile;
