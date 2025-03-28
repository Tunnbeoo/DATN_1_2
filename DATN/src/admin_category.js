import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { thoat } from './authSlice';
import { useEffect, useState } from "react";
import AdminCategoryThem from "./admin_category_Them";
import AdminCategorySua from "./admin_category_Sua";

function AdminCategory() {
    document.title="Quản lý Danh mục";
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [thongBao, setThongBao] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetch("http://localhost:3000/admin/category")
            .then(res => res.json())
            .then(data => {
                setCategory(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            });
    }, [refresh]); 
    
    const xoaDM = (id) => {
        if (window.confirm('Bạn muốn xóa danh mục này?') === false) return;
        
        fetch(`http://localhost:3000/admin/category/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                alert(data.thongbao);
                setRefresh(prev => !prev);
                
                setThongBao(true);
                setTimeout(() => {
                    setThongBao(false);
                }, 2000);
            })
            .catch(error => console.error("Lỗi khi xóa danh mục:", error));
    };
    
    const suaDM = (id) => {
        fetch(`http://localhost:3000/admin/category/${id}`)
            .then(res => res.json())
            .then(data => {
                setSelectedCategory(data);
            })
            .catch(error => console.error("Lỗi khi lấy thông tin danh mục:", error));
    };
    
    const Logout = () => {
        if(window.confirm('Bạn muốn đăng xuất?')) {
            dispatch(thoat());
            navigate('/');
        }
    };
    
    return(
        <div className="admin-container">
            {/* SIDEBAR */}
            <div className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <img src="/logo.png" alt="Logo" />
                    <h2>Admin Panel</h2>
                </div>
                
                <div className="admin-sidebar-user">
                    <img 
                        src={user?.hinh || "https://via.placeholder.com/100"} 
                        alt="User Avatar" 
                        className="admin-user-avatar" 
                    />
                    <div className="admin-user-info">
                        <h3>{user?.name || "Admin User"}</h3>
                        <p>{user?.email || "admin@example.com"}</p>
                    </div>
                </div>
                
                <ul className="admin-sidebar-menu">
                    <li>
                        <Link to="/admin/dashboard" className="admin-sidebar-link">
                            <i className="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/product" className="admin-sidebar-link">
                            <i className="fas fa-box"></i>
                            <span>Sản Phẩm</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/category" className="admin-sidebar-link active">
                            <i className="fas fa-list"></i>
                            <span>Danh Mục</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/user" className="admin-sidebar-link">
                            <i className="fas fa-users"></i>
                            <span>Người Dùng</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/order" className="admin-sidebar-link">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Đơn Hàng</span>
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={Logout} className="admin-sidebar-link">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Đăng Xuất</span>
                        </a>
                    </li>
                </ul>
            </div>

            {/* MAIN CONTENT */}
            <div className="admin-main">
                <div className="admin-header">
                    <h1>Quản Lý Danh Mục</h1>
                    <div className="admin-header-right">
                        <button 
                            type="button" 
                            className="btn-add" 
                            data-bs-toggle="modal" 
                            data-bs-target="#exampleModal"
                        >
                            <i className="fas fa-plus"></i> Thêm Danh Mục
                        </button>
                    </div>
                </div>

                {thongBao && (
                    <div className="notification success">
                        <i className="fas fa-check-circle"></i> Thay đổi danh mục thành công!
                    </div>
                )}

                <div className="admin-content">
                    {loading ? (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên Danh Mục</th>
                                        <th>Hình Ảnh</th>
                                        <th>Slug</th>
                                        <th>Thứ Tự</th>
                                        <th>Trạng Thái</th>
                                        <th>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {category.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.ten_loai}</td>
                                            <td>
                                                <img
                                                    src={item.img_loai}
                                                    alt={item.ten_loai}
                                                    className="category-img"
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                />
                                            </td>
                                            <td>{item.slug}</td>
                                            <td>{item.thu_tu}</td>
                                            <td>
                                                <span className={`status-badge ${item.an_hien === 1 ? 'active' : 'inactive'}`}>
                                                    {item.an_hien === 1 ? "Hiện" : "Ẩn"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#editModal"
                                                        onClick={() => suaDM(item.id)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => xoaDM(item.id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AdminCategoryThem setRefresh={setRefresh} />
            <AdminCategorySua setRefresh={setRefresh} category={selectedCategory} />
        </div>
    );
}

export default AdminCategory;
