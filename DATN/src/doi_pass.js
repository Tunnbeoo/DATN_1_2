import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const UppdatePassWord = () => {
  const [passhientai, setpasshientai] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Lấy thông tin người dùng từ Redux state
  const user = useSelector(state => state.auth.user);
  const userId = user ? user.id : null; // Lấy ID người dùng
  const navigate = useNavigate();

  const submitDoiPass = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/updatepass', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        passhientai,
        newPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(data => data.json())
    .then(data => {
      if (data.ok) {
        alert(data.thongbao);
      } else {
        alert(data.thongbao);
      }
      navigate('/login');
    })
    
  };

  return (
    <div>
      <form >
        <div>
          <label>Mật khẩu hiện tại</label>
          <input type="password" value={passhientai} onChange={(e) => setpasshientai(e.target.value)} />
        </div>
        <div>
          <label>Mật khẩu mới</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="button" onClick={(e) =>submitDoiPass(e)}>Đổi mật khẩu</button>
      </form>
    </div>
  );
};

export default UppdatePassWord;
