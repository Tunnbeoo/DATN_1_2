import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { thoat } from './authSlice';
// const doimoi = 'https://cdn.tgdd.vn/content/may-cu-24x24.png';

function Menu() {
  const cartItemCount = useSelector(state => state.cart.listSP.length);
  const user = useSelector(state => state.auth.user);
  const daDangNhap = useSelector(state => state.auth.daDangNhap);
  const dispatch = useDispatch();

  const Logout = () => {
    if (window.confirm('Bạn muốn đăng xuất?')) {
      dispatch(thoat());
    }
  };

  return (
    <div className="menu">
      <div className="box_menu">
        <NavLink to="/" className="flex items-center">
          <img style={{ width: '100px', height: '100px' }} src="../logofinal.jpeg" alt="Logo" className="h-12 w-auto cursor-pointer" />
        </NavLink>
      </div>
      <button type="button" className="btn search" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{ border: "none" }}>
        <input type="text" placeholder="Tìm kiếm sản phẩm" /><i style={{ fontSize: '22px', color: 'white', background: '#fdb813', width: '50px', height: '50px', borderRadius: '5px', padding: '10px' }} className="bi bi-search"></i>
      </button>

      <div className="user-menu">
        <button type="button" className="btn">
          <ul>
            <li className="user_box">
              {user === null || user === undefined ? (
                <div class="user-actions">
                  <a href="#"><i className="bi bi-person-circle"></i> Đăng nhập / Đăng ký</a>
                </div>
              ) : (
                <div style={{ fontSize: '25px', color: 'white' }}>{user.name}</div>
              )}
              <ul className="box_an_us_adm">
                <div className="triangle-box_user"></div>
                {!daDangNhap ? (
                  <>
                    <li><NavLink to="/#" className="menu-link">Thông tin cá nhân</NavLink></li>
                    <li><NavLink to="/login" className="menu-link">Đăng nhập</NavLink></li>
                  </>
                ) : (
                  <>
                    <li><NavLink to="/doimatkhau" className="menu-link">Đổi mật khẩu</NavLink></li>
                    <li>
                      <NavLink to={`/profile/${user.id}`} className="menu-link">
                        Thông tin cá nhân
                      </NavLink>
                    </li>

                    <li className="divider"></li>
                    <li>
                      <button className="logout" onClick={Logout}>Đăng xuất</button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </button>
      </div>

      <div id="box_tim_gio_user" className="d-flex" role="search">
        <button style={{ marginLeft: '-12px', fontSize: '21px', border: "none", marginTop: '10px', }} className="btn cart_box" type="button">
          <Link to="/showcart" activeClassName="a">
            <div class="user-actions">
              <a href="#" class="cart"><i class="fas fa-shopping-cart"></i> Giỏ hàng
                <button className="btn btn-outline-danger bg-danger" style={{ fontSize: '12px', height: '10px', borderRadius: '10px', padding: '8px', border: "none" }}>
                  <strong style={{ position: 'absolute', color: 'white' }}>{cartItemCount}</strong>
                </button>
              </a>
            </div>
          </Link>
        </button>

      </div>


    </div>
  );
}

export default Menu;
