import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { thoat } from './authSlice';
import { useEffect, useState } from "react";
import AdminCategoryThem from "./admin_category_Them";
import AdminCategorySua from "./admin_category_Sua";

function AdminCategory() {
    document.title="Quản lý Danh mục";
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const Logout = () => {
      if(window.confirm('Bạn muốn đăng xuất?')) {
        dispatch(thoat());
      }
    };
   const [category, setCategory] = useState([]);
   const [selectedCategory, setSelectedCategory] = useState(null);
   const [refresh, setRefresh] = useState(false);
   useEffect(() => {
    fetch("http://localhost:3000/admin/category")
        .then(res => res.json())
        .then(data => setCategory(data));
    }, [refresh]); 
    const xoaDM = (id)  => {
        if  (window.confirm('Bạn muốn xóa danh mục này?') === false) return;
        fetch(`http://localhost:3000/admin/category/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                alert(data.thongbao);
                setRefresh(prev => !prev);
            });
    };
    const suaDM = (id) => {
        fetch(`http://localhost:3000/admin/category/${id}`)
            .then(res => res.json())
            .then(data => {
                setSelectedCategory(data);
            });
    };
   return(
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
        <div class="text-center" style={{marginTop:'2%'}}>
        <div className="admin_product_article_box_content">
                      <div className="admin_product_article_box_content_title">
                        <h2 style={{float:'left'}}>Quản lý Danh mục</h2>
                      </div>
                      <div className="admin_product_article_box_content_bang">
                            <div className="admin_product_article_box_content_bang_box_btn" >
                                  <div className="btn_add" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo"><btn>Thêm danh mục</btn></div>
                                 
                            </div>
                            <hr/>
                            <div className="so"  style={{marginBottom: '15px',float:'left'}}>Hiện có <strong style={{border:  '1px solid #d4cfcf',padding: '5px'}} id="soSP">{category.length}</strong> danh mục <i style={{fontSize: '20px'}} className="fa-solid fa-caret-down"></i></div>
                            <table className="admin_product_article_box_content_bang_table">
                              <thead>
                                <tr>
                                    <th>Hình</th>
                                    <th style={{width:'30%'}}>Tên danh mục</th>
                                    <th>Thứ tự</th>
                                    <th>Ẩn hiện</th>
                                    <th>Thao tác</th>
                                </tr>
                              </thead>
                                <tbody>

                                {
                                    category.map( (l,index) =>{
                                        return(
                                        <tr style={{height:'100px',borderBottom: '1px solid #d4cfcf'}} key={index}>
                                            <td><img src={l.img_loai} alt={l.img_loai} style={{width:'65px',height:'60px'}}/></td>
                                            <td style={{fontWeight:"600"}}>{l.ten_loai}</td>
                                            <td style={{fontWeight:"600"}}>{l.thu_tu}</td>
                                            <td style={{fontWeight:"600"}}>{l.an_hien}</td>
                                            <td className="thao_tac">
                                            <button className="btn_thao_tac1" onClick={() => suaDM(l.id)} data-bs-toggle="modal" data-bs-target="#modalSua">Sửa</button>
                                            <button className="btn_thao_tac2" type="button" onClick={() => xoaDM(l.id)} >Xóa</button>
                                            </td>
                                        </tr>
                                        )
                                    })
                                }

                                </tbody>
                                

                          
                            </table>
                      </div>
                </div><br/>
        </div>
    </article>
    <AdminCategoryThem setRefresh={setRefresh}/> 
    <AdminCategorySua setRefresh={setRefresh} category={selectedCategory} />                            
</div>

   )

}

export default AdminCategory;
