import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { thoat } from './authSlice';

function Admin() {
    document.title="Quản lý Dashboard";
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const Logout = () => {
      if(window.confirm('Bạn muốn đăng xuất?')) {
        dispatch(thoat());
      }
    };
    return (

        <div className="admin_product">
            <aside className="admin_product_aside" >
                <div className="admin_product_aside_header">
                        <div className="admin_product_aside_header_title_img">
                                <img src={user.hinh} alt={user.hinh} />
                                <h3>{user.name}</h3>
                                <hr className="hr"/>
                        </div>
                        <div className="admin_product_aside_header_menu">
                                <ul>
                                        <li><Link to="/admin"><i className="fa-solid fa-layer-group"></i> Quản lý Dashboard</Link></li>
                                        <li><Link to="/admin/category"><i class="bi bi-list-task"></i> Quản lý Danh mục</Link></li>
                                        <li><Link to="/admin/product"><i className="fa-solid fa-tags"></i> Quản lý sản phẩm</Link></li>
                                        <li><Link to="/admin/user"><i className="fa-solid fa-user"></i> Quản lý tài khoản</Link></li>
                                        <li><Link to="/admin/order"><i className="fa-solid fa-pen-to-square"></i> Quản lí đơn hàng</Link></li> 
                                </ul>
                        </div>
                        <div className="admin_product_aside_header_logout"> 
                              <p>Đăng xuất</p>
                              <Link to="/#" onClick={Logout}><i className="fa-solid fa-right-from-bracket"></i></Link>
                        </div>
                </div>
            </aside>
            <article className="admin_product_article">
                <div className="admin_product_article_header">
                    <div className="admin_product_article_header_icon_logout"><Link to="/admin"><i class="bi bi-house-door-fill"></i></Link></div>
                </div>
                <div class="text-center" style={{marginTop:'20%'}}>
                    <div style={{color:'#149b9b',width:'80px',height:'80px',fontSize:"20px"}} class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div style={{marginTop:'20px'}}>Đang cập nhật thông tin...</div>
                </div>
            </article>
        </div>

    );
}
export default Admin;