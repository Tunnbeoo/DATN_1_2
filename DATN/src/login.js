import { Link, useNavigate, useLocation } from 'react-router-dom';
import './login.css';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { dalogin } from './authSlice';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  document.title = "Đăng nhập";

  const submitDuLieu = (e) => {
    e.preventDefault();

    if (!emailRef.current.value || !passwordRef.current.value) {
      alert("Nhập đủ thông tin nhé bạn ơi");
      return;
    }

    const url = "http://localhost:3000/login";
    let tt = { email: emailRef.current.value, password: passwordRef.current.value };
    const opt = {
      method: "POST",
      body: JSON.stringify(tt),
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(url, opt)
      .then((res) => res.json())
      .then((data) => {
        if (data.thongbao) {
          alert(data.thongbao);
        }
        if (data.token && data.userInfo) {
            dispatch(dalogin(data)); // Lưu vào Redux

            // Lưu userId vào Local Storage để dùng ở trang Thanh Toán
            localStorage.setItem("userId", data.userInfo.id);

            const from = location.state?.from?.pathname || '/';
            navigate(from);
        }
      })
  };

  return (
    <div className="login">
      <form>
        <div className="box_form">
          <h1>Login</h1>
          <div className="face_gg">
            <div className="face">
              <i style={{ padding: '5px' }} className="fa-brands fa-facebook"></i>
              <a href="#/">Login with Facebook</a>
            </div>
            <div className="gg">
              <i style={{ padding: '5px' }} className="fa-brands fa-google"></i>
              <a href="#/">Login with Google</a>
            </div>
          </div>
          <div className="or">
            <div><hr /></div>
            <div className="text_or">Or</div>
            <div><hr /></div>
          </div>
          <div className="inpt">
            <input type="text" placeholder="...@gmail.com" ref={emailRef} />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="inpt">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter password" 
              ref={passwordRef} 
            />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="check_b">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
              <label style={{ marginLeft: '8px' }}>Show Password</label>
            </div>
            <div className="forget">
              <Link to="/logout">Đăng ký tài khoản!</Link>
            </div>
          </div>

          {/* Nút Quên mật khẩu */}
          <div className="forget-password" style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>Quên mật khẩu?</Link>
          </div>

          <div className="btn">
            <button className="btn11" onClick={(e) => submitDuLieu(e)} type="button">Login</button>
          </div>
          <div className="btn">
            <Link to="/"><button className="btn22" type="button">Close</button></Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
