import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { thoat } from './authSlice';
import AdminProductThem from "./admin_product_Them";
import AdminProductSua from "./admin_product_Sua";

function AdminProduct() {
    document.title = "Quản lý sản phẩm";

    const [adminListSP, ganadminListSP] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]); 
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        fetch("http://localhost:3000/admin/sp")
            .then(res => res.json())
            .then(data => ganadminListSP(data));
    }, [refresh]); 
    
    const xoaSP = (id) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
    
        fetch(`http://localhost:3000/admin/sp/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                alert(data.thongbao);
                if (!data.error) {
                    setRefresh(prev => !prev); // Cập nhật để reload dữ liệu
                }
            })
            .catch(error => console.error("Lỗi xóa sản phẩm:", error));
    };
 

    const selectProduct = (product) => {
        setSelectedProduct(product);
    };

    const Logout = () => {
        if (window.confirm('Bạn muốn đăng xuất?')) {
            dispatch(thoat());
            window.location.href = '/';
        }
    };

    return (
        <div className="admin_product">
            <aside className="admin_product_aside">
                <div className="admin_product_aside_header">
                    <div className="admin_product_aside_header_title_img">
                        <img src={user.hinh} alt={user.hinh} />
                        <h3>{user.name}</h3>
                        <hr className="hr" />
                    </div>
                    <div className="admin_product_aside_header_menu">
                        <ul>
                            <li><Link to="/admin"><i className="fa-solid fa-layer-group"></i> Quản lý dashboard</Link></li>
                            <li><Link to="/admin/category"><i className="bi bi-list-task"></i> Quản lý danh mục</Link></li>
                            <li><Link to="/admin/product"><i className="fa-solid fa-tags"></i> Quản lý sản phẩm </Link></li>
                            <li><Link to="/admin/user"><i className="fa-solid fa-user"></i> Quản lý tài khoản</Link></li>
                            <li><Link to="/admin/order"><i className="fa-solid fa-pen-to-square"></i> Quản lý đơn hàng</Link></li>
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
                    <div className="admin_product_article_header_icon_logout">
                        <Link to="/admin"><i className="bi bi-house-door-fill"></i></Link>
                    </div>
                </div>
                <div className="admin_product_article_box_content">
                    <div className="admin_product_article_box_content_title">
                        <h2>Quản lý Danh mục</h2>
                    </div>
                    <div className="admin_product_article_box_content_bang">
                        <div className="admin_product_article_box_content_bang_box_btn">
                            <div className="btn_add" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
                                <btn>Thêm sản phẩm</btn>
                            </div>
                        </div>
                        <hr />
                        <div className="so" style={{ marginBottom: '15px' }}>
                            Hiện có <strong style={{ border: '1px Solid #d4cfcf', padding: '5px' }} id="soSP">{adminListSP.length}</strong> sản phẩm <i style={{ fontSize: '20px' }} className="fa-solid fa-caret-down"></i>
                        </div>
                        <table className="admin_product_article_box_content_bang_table">
                            <thead>
                                <tr>
                                    <th>Hình</th>
                                    <th>Mã</th>
                                    <th style={{ width: '30%' }}>Tên sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Loại</th>
                                    <th>Ram</th>
                                    <th>Cpu</th>
                                    <th>Ngày</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminListSP.slice(0, 500).map((sp, index) => (
                                    <tr key={index} style={{ height: '100px', borderBottom: '1px solid #d4cfcf', background: '#fff' }}>
                                        <td><img src={sp.hinh} alt={sp.hinh} style={{ width: '65px', height: '60px' }} /></td>
                                        <td style={{ fontWeight: "600" }}>{sp.id}</td>
                                        <td style={{ fontWeight: "600", padding: '10px' }}>{sp.ten_sp}</td>
                                        <td style={{ fontWeight: "600", color: 'red' }}>{parseFloat(sp.gia_km).toLocaleString("vi")} VNĐ</td>
                                        <td style={{ fontWeight: "600" }}>{sp.ten_loai}</td>
                                        <td style={{ fontWeight: "600" }}>{sp.ram}</td>
                                        <td style={{ fontWeight: "600" }}>{sp.cpu}</td>
                                        <td style={{ fontWeight: "600" }}>{new Date(sp.ngay).toLocaleDateString('vi-VN')}</td>
                                        <td className="thao_tac">
                                            <button className="btn_thao_tac1" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" data-bs-whatever="@mdo" onClick={() => selectProduct(sp)}>Sửa</button>
                                            <button className="btn_thao_tac2" type="button" onClick={() => xoaSP(sp.id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </article>
            <AdminProductThem setRefresh={setRefresh} />
            <AdminProductSua setRefresh={setRefresh} />
        </div>
    );
}

export default AdminProduct;
