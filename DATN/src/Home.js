
import banner_n1 from './img/banner_n1.webp'
import banner5 from './img/banner5.jpg'
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
// xử lí giỏ hàng
import { useDispatch, useSelector } from 'react-redux';
import { themSP } from './cartSlice';


 function Home() { 
    document.title="Trang chủ";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const daDangNhap = useSelector(state => state.auth.daDangNhap);
    const [listsp, ganListSP] = useState( [] );
    
    useEffect ( () => {
       fetch("http://localhost:3000/spmoi/1")
       .then(res=>res.json()).then(data => ganListSP(data));
    } , []);

    const sapXepGiaTang = () => {
        const sx = [...listsp].sort((a,b) => {  
        const giax = parseFloat(a.gia);
        const giay = parseFloat(b.gia);
        return giax - giay;
        });
        ganListSP(sx);
    };
    const sapXepGiaGiam = () => {
        const sx = [...listsp].sort((a,b) => {
        const giax = parseFloat(a.gia);
        const giay = parseFloat(b.gia);
        return giay - giax;
        });
        ganListSP(sx);
    };
    const [thongBao, setThongBao] = useState(false);
   
    const xuli = (sanpham) => {
        if (!daDangNhap) {
            if(window.confirm("Đăng nhập để thêm sản phẩm vào giỏ hàng !")){
                navigate('/login');
                return;
            }
        }
        dispatch(themSP(sanpham));
        setThongBao(true);
        setTimeout(() => {
            setThongBao(false);
        }, 2000);
    };
    
    return (
       <div>
          {thongBao && (
                        <div className="thongbao" >
                            Sản phẩm đã được thêm!
                        </div>
            )}
        <div className="troVe"><a href="#header"><i className="bi bi-arrow-up-short"></i></a></div>
            <div id="carouselExampleIndicators" className="carousel slide_con">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
               
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className="box_titile_Home">
                <div className="titile_SP" >
                    <h2>SẢN PHẨM MỚI 2024! </h2>
                    <hr className="h_r"></hr>
                </div>
                <div className="box_chucnang_loc_home">
                    <label style={{marginRight:'5px',padding:'5px',fontWeight:'700',fontSize:'15px'}}>LỌC: </label>
                    <select style={{ width: '220px', padding: '3px', borderRadius: '2px', border: '1px solid gray' ,fontSize:'15px',}} 
                    onChange={(e) => { if (e.target.value === '2') {sapXepGiaTang();} else if(e.target.value === '3'){sapXepGiaGiam()} }}
                    >
                        <option value={1}>Các chức năng:</option>
                        <option value={2}>Giá thấp đến cao</option>
                        <option value={3}>Giá cao đến thấp</option>
                        <option value={4}>Sản phẩm được quan tâm</option>
                    </select>
                </div>
            </div>
            <div className="tong_box_SP">
                {listsp.map((sp, i) => (
                    <div className="box_SP" key={i}>
                    <div className="box_SP_box_giam_gia">
                        <div className="chunhat-box"> - {sp.phan_tram_gg}%</div>
                        <div className="triangle-box"></div>
                    </div>
                    <div className="box_SP_anh">
                         <Link to= {`/sanpham/${sp.id}/${sp.id_loai}`} activeClassName="a"><img src={sp.hinh} title={(sp.ten_sp).toLocaleUpperCase()} alt={sp.ten_sp} /></Link>
                    </div>
                    <div className='add_SP' onClick={() => xuli(sp)}><i class="bi bi-bag-plus-fill"></i></div>
                    <div className="box_SP_tensp"><Link to= {`/sanpham/${sp.id}/${sp.id_loai}`} activeClassName="a">{sp.ten_sp}</Link></div>
                    <div className="box_SP_RAM_SSD">
                        <div><button className="box_SP_RAM" >RAM: {sp.ram}</button></div>
                        <div><button className="box_SP_SSD" >SSD: {sp.dia_cung}</button></div>
                    </div>
                    <div className="box_SP_gia">
                        <div className="box_SP_gia_km">{parseFloat(sp.gia_km).toLocaleString("vi")}VNĐ</div>
                        <div className="box_SP_gia_goc"><del>{parseFloat(sp.gia).toLocaleString("vi")}VNĐ</del></div>
                    </div>
                    <div className="box_SP_luot_xem"><p>Lượt xem: {sp.luot_xem}</p></div>
                    <div className="box_SP_icon">
                        <div className="box_SP_icon_star">
                            <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                            <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                            <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                            <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                            <div className="box_SP_icon_star_nhat"><i className="bi bi-star-fill"></i></div>
                            <div className="box_SP_icon_star_dg"><p>(Đánh giá)</p></div>
                    
                        </div>
                    
                    </div>
                </div>
            
                    
                ))}
                
            </div>
            <div className="carousel-inner" style={{padding:'10px'}}>
                    <div className="carousel-item active">
                    <img src={banner_n1} style={{width:'1200px', height:'170px', borderRadius:'10px'}} className="d-block w-100" alt={banner_n1}/>
                    </div>
                    <div className="carousel-item">
                    <img src={banner5} style={{width:'1200px', height:'170px', borderRadius:'10px'}}  className="d-block w-100" alt={banner5}/>
                    </div>
                    <div className="carousel-item">
                    <img src={banner_n1} style={{width:'1200px', height:'170px',borderRadius:'10px' }}  className="d-block w-100" alt={banner_n1}/>
                    </div>
                </div>
       </div>
     
)}// function
export default Home;