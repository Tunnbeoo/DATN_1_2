import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Footer from './footer';
import PageHome from './Page_Home';
import Menu from './Menu';
import GioiThieu from './Page_GioiThieu';
import ProductDetail from './Page_Product_Detail';
import ShowProductOneKind from './Page_Show_Product_Kind';
import NotFound from './NotFound';
import ShowCart from './showCart';
import ThanhToan from './ThanhToan';
import CamOn from './camon';
import Profile from "./Profile";
import ThanhTimKiem from './thanhtiemkiem';
import Admin from './admin_dashborad';
import AdminProduct from './admin_product';
import AdminUser from './admin_user';
import AdminOrder from './admin_order';
import Login from './login';
import { useSelector } from 'react-redux';
import ForgotPassword from './ForgotPassword';  
import HienSPTrongMotTrang from './HienSPTrongMotTrang';
import SoSanh from './SoSanh';
import ProtectedRoute from './ProtectedRoute';
import UppdatePassWord from './doi_pass';
import Logout from './logout';
import AdminCategory from './admin_category';
import Laptop from './laptop';
function App() {
  const daDangNhap = useSelector(state => state.auth.daDangNhap);
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (['/admin', '/admin/product', '/admin/user', '/admin/order', '/admin/category', '/login', '/logout'].includes(location.pathname)) {
      setShowHeaderFooter(false);
    } else {
      setShowHeaderFooter(true);
    }
  }, [location]);

  return (
    <div className='container-fulid'>
      {showHeaderFooter && (
        <header id="header">
          <nav id="navv">
            <div className="top-bar">
              <span>HOTLINE: 0123456789</span>
              <div className="top-links">
                <a href="#"><i className="fas fa-info-circle"></i> Hướng dẫn mua hàng</a>
                <a href="#"><i className="fas fa-gift"></i> Ưu đãi khách hàng</a>
                <a href="#"><i className="fas fa-phone"></i> Thông tin liên hệ</a>
              </div>
            </div>
            <div className="container1">
              <Menu />
            </div>
            <div class="menu_p">
            <a href="#"><i class="fas fa-eye"></i> Sản phẩm bạn vừa xem</a>
            <a href="#"><i class="fas fa-fire"></i> Sản phẩm mua nhiều</a>
            <a href="#"><i class="fas fa-percent"></i> Sản phẩm khuyến mãi</a>
            <a href="#"><i class="fas fa-credit-card"></i> Hình thức thanh toán</a>
            </div>
            <div class="navbar">
            <div class="navbar-left">
                <div class="dropdown">
                  <a href="#" class="nav-item dropbtn">
                    ☰ Danh mục sản phẩm
                  </a>
                  <div class="dropdown-content">
                  <Link to= {`/laptop`} routerLinkActive="a"><a href="#">LapTop</a></Link>
                    <a href="#">Phụ kiện</a>
                    <a href="#">Phần mềm</a>
                    </div>
                </div>
              </div>
            <div class="navbar-right">
              <a href="" class="nav-item">
              <i class="fa-solid fa-newspaper"></i> Thủ thuật & Tin Tức
              </a>
              <a href="#" class="nav-item">
              <i class="fa-solid fa-circle-dollar-to-slot"></i> Hướng dẫn mua hàng
              </a>
              <a href="#" class="nav-item">
              <i class="fa-solid fa-hand-holding-hand"></i> Liên hệ hợp tác
              </a>
            </div>
          </div>
          </nav>
        </header>
      )}

      {/* Box tìm kiếm */}
      <div style={{ marginTop: '5%', width: '50%', marginLeft: '25%' }} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <ThanhTimKiem />
      </div>

      {/* Box giỏ hàng */}
      <div style={{ zIndex: '2001' }} className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
        <div className="offcanvas-header">
          <h5 style={{ fontWeight: "700" }} className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Giỏ hàng</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <li style={{ listStyle: 'none' }}>
            <Link to="/showcart"><button className="btn btn-outline-info" data-bs-dismiss="offcanvas">Xem giỏ hàng</button></Link>
          </li>
        </div>
      </div>

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Route trang quên mật khẩu */}
          <Route path="/gioithieu" element={daDangNhap ? <GioiThieu /> : <Navigate to="/login" />} />
          <Route path="/sanpham/:id/:id_loai" element={<ProductDetail />} />
          <Route path="/loai/:id" element={<ShowProductOneKind />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/" element={<PageHome />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/hien-thi-san-pham" element={<HienSPTrongMotTrang />} />
          <Route path="/so-sanh" element={<SoSanh />} />
          <Route path="/laptop" element={<Laptop/>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/showcart" element={<ShowCart />} />
            <Route path="/thanhtoan/" element={<ThanhToan />} />
            <Route path="/thanks" element={<CamOn />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/product" element={<AdminProduct />} />
            <Route path="/admin/user" element={<AdminUser />} />
            <Route path="/admin/order" element={<AdminOrder />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/doimatkhau" element={<UppdatePassWord />} />
          </Route>
        </Routes>
      </main>

      {showHeaderFooter && (
        <footer className="footer">
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default App;
