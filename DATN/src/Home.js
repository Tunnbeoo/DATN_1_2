import React from 'react';
import './boxPro.css';
import './App.css';
import banner_n1 from './img/banner_n1.webp';
import banner5 from './img/banner5.jpg';
import { Link, useNavigate } from "react-router-dom";
import { themVaoSoSanh } from './compareSlice';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { themSP } from './cartSlice';
import './home_sosanh.css';

function Home() {
    document.title = "Trang chủ";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const daDangNhap = useSelector(state => state.auth.daDangNhap);
    const [listsp, ganListSP] = useState([]);
    const danhSachSoSanh = useSelector(state => state.compare.danhSachSoSanh);
    const [comparisonList, setComparisonList] = useState([]);
    const [isCompareBoxVisible, setIsCompareBoxVisible] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/spmoi/1")
            .then(res => res.json())
            .then(data => ganListSP(data));
    }, []);

    useEffect(() => {
        const isVisible = localStorage.getItem('isCompareBoxVisible') === 'true';
        setIsCompareBoxVisible(isVisible);
    }, []);

    const sapXepGiaTang = () => {
        const sx = [...listsp].sort((a, b) => {
            const giax = parseFloat(a.gia);
            const giay = parseFloat(b.gia);
            return giax - giay;
        });
        ganListSP(sx);
    };

    const sapXepGiaGiam = () => {
        const sx = [...listsp].sort((a, b) => {
            const giax = parseFloat(a.gia);
            const giay = parseFloat(b.gia);
            return giay - giax;
        });
        ganListSP(sx);
    };

    const [thongBao, setThongBao] = useState(false);

    const xuli = (sanpham) => {
        if (!daDangNhap) {
            if (window.confirm("Đăng nhập để thêm sản phẩm vào giỏ hàng!")) {
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

    const themSoSanhVaChuyenTrang = (sanpham) => {
        if (comparisonList.length >= 3) {
            alert("Bạn chỉ có thể so sánh tối đa 3 sản phẩm!");
            return;
        }
        console.log("🔍 Sản phẩm thêm vào so sánh:", sanpham);
        addProductToCompare(sanpham);
        setThongBao(true);
        setTimeout(() => {
            setThongBao(false);
            showCompareBox();
        }, 1000);
    };

    const addProductToCompare = (product) => {
        if (comparisonList.length < 3) {
            setComparisonList([...comparisonList, product]);
        }
    };

    const removeProductFromCompare = (productId) => {
        setComparisonList(comparisonList.filter(product => product.id !== productId));
    };

    const clearCompare = () => {
        setComparisonList([]);
        setIsCompareBoxVisible(false);
        localStorage.setItem('isCompareBoxVisible', 'false');
    };

    const showCompareBox = () => {
        setIsCompareBoxVisible(true);
        localStorage.setItem('isCompareBoxVisible', 'true');
    };

    const handleCompareNow = () => {
        navigate('/so-sanh');
    };

    const handleScrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div>
            {thongBao && (
                <div className="thongbao">
                    Sản phẩm đã được thêm!
                </div>
            )}
            <div className="troVe"><a href="#header" onClick={handleScrollToTop}><i className="bi bi-arrow-up-short"></i></a></div>
            <div id="carouselExampleIndicators" className="carousel slide_con">
                {/* <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div> */}
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
                <div className="titile_SP">
                    <h2>SẢN PHẨM MỚI 2025!</h2>
                    <hr className="h_r"></hr>
                </div>
                <div className="box_chucnang_loc_home">
                    <label style={{ marginRight: '5px', padding: '5px', fontWeight: '700', fontSize: '15px' }}>LỌC: </label>
                    <select style={{ width: '220px', padding: '3px', borderRadius: '2px', border: '1px solid gray', fontSize: '15px' }}
                        onChange={(e) => { if (e.target.value === '2') { sapXepGiaTang(); } else if (e.target.value === '3') { sapXepGiaGiam(); } }}>
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
                        {/* Nhãn giảm giá */}
                        {sp.phan_tram_gg && (
                            <div className="box_SP_khuyen_mai">
                                Giảm {sp.phan_tram_gg}%
                            </div>
                        )}
                        {/* Hình ảnh sản phẩm */}
                        <div className="box_SP_anh">
                            <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                                <img src={sp.hinh} title={sp.ten_sp.toUpperCase()} alt={sp.ten_sp} />
                            </Link>
                        </div>
                        {/* Icon giỏ hàng */}
                        <div className="cart_icon" onClick={() => xuli(sp)}>
                            <i className="bi bi-bag-plus-fill"></i>
                        </div>
                        {/* Tên sản phẩm */}
                        <div className="box_SP_tensp">
                            <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>{sp.ten_sp}</Link>
                        </div>
                        {/* Thông số RAM và SSD */}
                        <div className="box_SP_RAM_SSD">
                            <div><button className="box_SP_RAM">RAM: {sp.ram}</button></div>
                            <div><button className="box_SP_SSD">SSD: {sp.dia_cung}</button></div>
                        </div>
                        {/* Giá sản phẩm */}
                        <div className="box_SP_gia">
                            <div className="box_SP_gia_km">{parseFloat(sp.gia_km).toLocaleString("vi")} VNĐ</div>
                            <div className="box_SP_gia_goc"><del>{parseFloat(sp.gia).toLocaleString("vi")} VNĐ</del></div>
                        </div>
                        {/* Lượt xem */}
                        <div className="box_SP_luot_xem"><p>Lượt xem: {sp.luot_xem}</p></div>
                        {/* Đánh giá và nút so sánh */}
                        <div className="box_SP_icon">
                            <div className="box_SP_icon_star">
                                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                                <div className="box_SP_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                                <div className="box_SP_icon_star_nhat"><i className="bi bi-star-fill"></i></div>
                                <div className="box_SP_icon_star_dg"><p>(Đánh giá)</p></div>
                            </div>
                            <div className="so_sanh">
                                <button className="so_sanh_btn" onClick={() => themSoSanhVaChuyenTrang(sp)}>
                                    So sánh
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="carousel-inner" style={{ padding: '10px' }}>
                <div className="carousel-item active">
                    <img src={banner_n1} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt={banner_n1} />
                </div>
                <div className="carousel-item">
                    <img src={banner5} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt={banner5} />
                </div>
                <div className="carousel-item">
                    <img src={banner_n1} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt={banner_n1} />
                </div>
            </div>
            {isCompareBoxVisible && (
                <div className="stickcompare stickcompare_new cp-desktop spaceInDown">
                    <a href="javascript:;" onClick={clearCompare} className="clearall">
                        <i className="bi bi-x"></i>Thu gọn
                    </a>
                    <ul className="listcompare">
                        {comparisonList.map(sp => (
                            <li key={sp.id}>
                                <span className="remove-ic-compare" onClick={() => removeProductFromCompare(sp.id)}>
                                    <i className="bi bi-x"></i>
                                </span>
                                <img src={sp.hinh} alt={sp.ten_sp} />
                                <h3>{sp.ten_sp}</h3>
                                <div className="product-info">
                                    <div>RAM: {sp.ram}</div>
                                    <div>SSD: {sp.dia_cung}</div>
                                    <div className="price">{parseFloat(sp.gia_km).toLocaleString("vi")}₫</div>
                                </div>
                            </li>
                        ))}
                        {comparisonList.length < 3 && (
                            <li className="formsg">
                                <div className="cp-plus cp-plus_new">
                                    <i className="bi bi-plus-lg"></i>
                                    <p>Thêm sản phẩm</p>
                                </div>
                            </li>
                        )}
                    </ul>
                    <div className="closecompare">
                        <a href="javascript:;" onClick={handleCompareNow} className="doss">
                            So sánh ngay
                        </a>
                        <a href="javascript:;" onClick={clearCompare} className="txtremoveall">
                            Xóa tất cả
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;