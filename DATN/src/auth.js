import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { dalogin } from './authSlice';

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const dispatch = useDispatch();
  const [isLoginMode, setIsLoginMode] = useState(true); // Chuyển đổi giữa Login và Register
  const [staySignedIn, setStaySignedIn] = useState(false);

  document.title = isLoginMode ? "Đăng nhập - LaptopCenter" : "Đăng ký - LaptopCenter";

  const submitDuLieu = (e) => {
    e.preventDefault();

    if (!emailRef.current.value || !passwordRef.current.value) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    if (!isLoginMode && passwordRef.current.value !== confirmPasswordRef.current.value) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const url = isLoginMode ? "http://localhost:3000/login" : "http://localhost:3000/register";
    let tt = { 
      email: emailRef.current.value, 
      password: passwordRef.current.value 
    };
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
        if (isLoginMode && data.token && data.userInfo) {
          dispatch(dalogin(data));
          localStorage.setItem("userId", data.userInfo.id);
          const from = location.state?.from?.pathname || '/';
          navigate(from);
        } else if (!isLoginMode && data.success) {
          alert("Đăng ký thành công!");
          setIsLoginMode(true); // Chuyển về chế độ đăng nhập sau khi đăng ký thành công
        }
      })
      .catch((error) => {
        alert("Đã xảy ra lỗi, vui lòng thử lại sau");
      });
  };

  // Inline styles
  const styles = {
    container: {
      background: '#f5f5f5',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    box: {
      background: '#fff',
      borderRadius: '8px',
      padding: '40px 30px',
      width: '100%',
      maxWidth: '380px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    logo: {
      fontSize: '40px',
      color: '#000',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      marginBottom: '10px',
      color: '#000',
      fontWeight: 600,
    },
    subtitle: {
      color: '#6e6e73',
      fontSize: '14px',
      marginBottom: '25px',
    },
    inputGroup: {
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #d2d2d7',
      borderRadius: '6px',
      fontSize: '16px',
      background: '#fff',
      boxSizing: 'border-box',
    },
    options: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: '20px 0',
      fontSize: '14px',
      width: '100%',
      padding: '0 5px',
    },
    staySignedIn: {
      display: 'flex',
      alignItems: 'center',
    },
    checkbox: {
      marginRight: '8px',
      width: '16px',
      height: '16px',
    },
    label: {
      color: '#1d1d1f',
      cursor: 'pointer',
      fontSize: '14px',
    },
    forgotPassword: {
      color: '#0071e3',
      textDecoration: 'none',
      fontSize: '14px',
    },
    loginBtn: {
      width: '100%',
      padding: '12px',
      background: '#0071e3',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 500,
      cursor: 'pointer',
    },
    register: {
      marginTop: '25px',
      fontSize: '14px',
      color: '#6e6e73',
    },
    link: {
      color: '#0071e3',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  };

  return React.createElement(
    'div',
    { style: styles.container },
    React.createElement(
      'div',
      { style: styles.box },
      React.createElement(
        'div',
        { style: styles.logo },
        React.createElement('i', { className: 'bi bi-laptop' }) // Logo máy tính
      ),
      React.createElement(
        'h1',
        { style: styles.title },
        isLoginMode ? 'Đăng nhập' : 'Đăng ký'
      ),
      React.createElement(
        'p',
        { style: styles.subtitle },
        isLoginMode ? 'Đăng nhập để mua sắm tại LaptopCenter' : 'Tạo tài khoản để mua sắm tại LaptopCenter'
      ),
      React.createElement(
        'form',
        { onSubmit: submitDuLieu },
        React.createElement(
          'div',
          { style: styles.inputGroup },
          React.createElement('input', {
            type: 'email',
            id: 'email',
            ref: emailRef,
            placeholder: 'Email',
            required: true,
            autoComplete: 'email',
            style: styles.input,
          })
        ),
        React.createElement(
          'div',
          { style: styles.inputGroup },
          React.createElement('input', {
            type: 'password',
            id: 'password',
            ref: passwordRef,
            placeholder: 'Mật khẩu',
            required: true,
            autoComplete: 'current-password',
            style: styles.input,
          })
        ),
        !isLoginMode &&
          React.createElement(
            'div',
            { style: styles.inputGroup },
            React.createElement('input', {
              type: 'password',
              id: 'confirm-password',
              ref: confirmPasswordRef,
              placeholder: 'Xác nhận mật khẩu',
              required: true,
              style: styles.input,
            })
          ),
        isLoginMode
          ? React.createElement(
              'div',
              { style: styles.options },
              React.createElement(
                'div',
                { style: styles.staySignedIn },
                React.createElement('input', {
                  type: 'checkbox',
                  id: 'stay-signed-in',
                  checked: staySignedIn,
                  onChange: () => setStaySignedIn(!staySignedIn),
                  style: styles.checkbox,
                }),
                React.createElement(
                  'label',
                  { htmlFor: 'stay-signed-in', style: styles.label },
                  'Duy trì đăng nhập'
                )
              ),
              React.createElement(
                Link,
                { to: '/forgot-password', style: styles.forgotPassword },
                'Quên mật khẩu?'
              )
            )
          : React.createElement(
              'div',
              { style: styles.options },
              React.createElement(
                'div',
                { style: styles.staySignedIn },
                React.createElement('input', {
                  type: 'checkbox',
                  id: 'terms',
                  required: true,
                  style: styles.checkbox,
                }),
                React.createElement(
                  'label',
                  { htmlFor: 'terms', style: styles.label },
                  'Tôi đồng ý với điều khoản sử dụng'
                )
              )
            ),
        React.createElement(
          'button',
          { type: 'submit', style: styles.loginBtn },
          isLoginMode ? 'Đăng nhập' : 'Đăng ký'
        )
      ),
      React.createElement(
        'div',
        { style: styles.register },
        React.createElement(
          'p',
          null,
          isLoginMode ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? ',
          React.createElement(
            'span',
            {
              onClick: () => setIsLoginMode(!isLoginMode),
              style: styles.link,
            },
            isLoginMode ? 'Tạo tài khoản mới' : 'Đăng nhập ngay'
          )
        )
      )
    )
  );
}

export default Auth;