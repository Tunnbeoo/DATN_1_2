import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner_n1 from './img/banner_n1.webp';
import banner5 from './img/banner5.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { themSP } from './cartSlice';
import { themVaoSoSanh } from './compareSlice';

function TitleH2() {
  return (
    <div className="titile_SP">
      <h2>SẢN PHẨM HOT THÁNG 6</h2>
      <hr className="h_r"></hr>
    </div>
  );
}

function SPXemNhieu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const daDangNhap = useSelector(state => state.auth.daDangNhap);
  const danhSachSoSanh = useSelector(state => state.compare.danhSachSoSanh);
  const [listsp, setListSP] = useState([]);
  const [sotin, setXemNhieu] = useState(12);
  const [daSapXep, setDaSapXep] = useState(false);
  const [thongBao, setThongBao] = useState(false);
  const [isCompareBoxVisible, setIsCompareBoxVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/sphot")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListSP(data);
        } else {
          setListSP([]);
        }
      })
      .catch(error => {
        console.error('Error fetching hot products:', error);
        setListSP([]);
      });
  }, []);

  useEffect(() => {
    const isVisible = localStorage.getItem('isCompareBoxVisible') === 'true';
    setIsCompareBoxVisible(isVisible);
  }, []);

  const showCompareBox = () => {
    setIsCompareBoxVisible(true);
    localStorage.setItem('isCompareBoxVisible', 'true');
  };

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
    if (danhSachSoSanh.length >= 3) {
      alert("Bạn chỉ có thể so sánh tối đa 3 sản phẩm!");
      return;
    }
    dispatch(themVaoSoSanh(sanpham));
    setThongBao(true);
    setTimeout(() => {
      setThongBao(false);
      showCompareBox();
    }, 1000);
  };

  // Cài đặt cho slideshow ở giữa trang
  const slideSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Chuyển từ slider sang hiển thị grid như trong hình
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {thongBao && (
        <div className="thongbao">
          Sản phẩm đã được thêm vào so sánh!
        </div>
      )}
      <div className="box_spxn">
        <TitleH2 />
        
        {/* Banner thu cũ lên đời */}
        <div style={{ 
          width: '100%', 
          backgroundColor: '#fce83a', 
          borderRadius: '5px',
          marginBottom: '20px',
          padding: '10px',
          textAlign: 'center',
          color: '#ff0000',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          THU CŨ LÊN ĐỜI - TRỢ GIÁ ĐẾN 2 TRIỆU
        </div>

        {/* Grid hiển thị sản phẩm */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          width: '100%'
        }}>
          {Array.isArray(listsp) && listsp
            .sort((a, b) => b.luot_xem - a.luot_xem)
            .slice(0, sotin)
            .map((sp, i) => (
              <div key={sp.id_sp || sp.id} style={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                padding: '15px',
                position: 'relative',
                backgroundColor: 'white',
                transition: 'all 0.3s ease'
              }}>
                {/* Trả chậm 0% */}
                <div style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  left: '10px', 
                  color: '#003399', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  zIndex: 2 
                }}>
                  Trả chậm 0%
                </div>

                {/* Nhãn mẫu mới (nếu có) */}
                {sp.is_new && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    color: '#ff5050', 
                    background: '#ffdddd',
                    padding: '2px 8px',
                    borderRadius: '3px',
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    zIndex: 2 
                  }}>
                    Mẫu mới
                  </div>
                )}

                {/* Nhãn đặc quyền (nếu có) */}
                {sp.is_hot && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '45%', 
                    left: '0', 
                    background: 'url("data:image/png;base64,") no-repeat',
                    width: '42px',
                    height: '42px',
                    backgroundSize: 'contain',
                    zIndex: 2 
                  }}>
                    <div style={{ color: '#734d12', fontSize: '7px', textAlign: 'center', marginTop: '8px' }}>
                      <strong>ĐẶC<br/>QUYỀN</strong>
                    </div>
                  </div>
                )}

                {/* Hình ảnh sản phẩm */}
                <div style={{ 
                  width: '100%', 
                  height: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px',
                  marginTop: '15px'
                }}>
                  <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                    <img 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '180px', 
                        objectFit: 'contain' 
                      }} 
                      src={sp.hinh} 
                      title={(sp.ten_sp).toLocaleUpperCase()} 
                      alt={sp.ten_sp} 
                    />
                  </Link>
                </div>

                {/* Thông tin CPU */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  <div>i5 {sp.cpu || '12450H'}</div>
                  <div>{sp.gpu_type || 'Intel UHD'}</div>
                </div>

                {/* Tên sản phẩm */}
                <div style={{ height: '40px', marginBottom: '8px' }}>
                  <Link to={`/sanpham/${sp.id}/${sp.id_loai}`} style={{ 
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    textDecoration: 'none'
                  }}>
                    {sp.ten_sp}
                  </Link>
                </div>

                {/* Thông tin RAM và SSD */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '10px',
                  backgroundColor: '#f5f5f5',
                  padding: '5px',
                  borderRadius: '3px'
                }}>
                  <div>RAM {sp.ram || '16 GB'}</div>
                  <div>SSD {sp.dia_cung || '512 GB'}</div>
                </div>

                {/* Hiển thị giá */}
                <div>
                  {/* Online giá rẻ quá (tùy theo sản phẩm) */}
                  {sp.gia_km < sp.gia && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#ff6600', 
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      Online giá rẻ quá
                    </div>
                  )}
                  
                  {/* Giá khuyến mãi */}
                  <div style={{ 
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ff0000',
                    marginBottom: '5px'
                  }}>
                    {parseFloat(sp.gia_km || sp.gia).toLocaleString("vi")}₫
                  </div>
                  
                  {/* Giá gốc và phần trăm giảm */}
                  {sp.gia_km && sp.gia_km !== sp.gia && (
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <div style={{ 
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '12px',
                        marginRight: '5px'
                      }}>
                        {parseFloat(sp.gia).toLocaleString("vi")}₫
                      </div>
                      <div style={{ 
                        color: '#ff0000',
                        fontSize: '12px'
                      }}>
                        -{Math.round(((sp.gia - sp.gia_km) / sp.gia) * 100)}%
                      </div>
                    </div>
                  )}
                  
                  {/* Quà tặng */}
                  <div style={{ 
                    fontSize: '13px',
                    color: '#008800',
                    marginTop: '5px',
                    marginBottom: '5px'
                  }}>
                    Quà {(Math.round(sp.gia_km * 0.14 / 10000) * 10000).toLocaleString("vi")}₫
                  </div>
                </div>

                {/* Đánh giá và lượt bán */}
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '8px',
                  fontSize: '12px'
                }}>
                  {/* Sao đánh giá */}
                  <div style={{ color: '#ffc120' }}>★</div>
                  <div style={{ marginLeft: '3px', marginRight: '8px' }}>
                    {(4.5 + Math.random() * 0.5).toFixed(1)}
                  </div>
                  
                  {/* Lượt bán */}
                  <div style={{ color: '#666' }}>
                    • Đã bán {Math.floor(sp.luot_xem / 2 + Math.random() * 500)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Thêm slideshow ở đây */}
      <div style={{ marginTop: '30px', marginBottom: '30px' }}>
        <div className="titile_SP">
          <h2>SẢN PHẨM NỔI BẬT</h2>
          <hr className="h_r"></hr>
        </div>
        
        <div className="slider-container" style={{ width: '100%', marginTop: '20px' }}>
          <Slider {...slideSettings}>
            {Array.isArray(listsp) && listsp
              .sort((a, b) => a.gia_km - b.gia_km) // Sắp xếp theo giá từ thấp đến cao
              .slice(0, 8)
              .map((sp, i) => (
                <div key={i} style={{ padding: '0 10px', position: 'relative' }}>
                  <div style={{ 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px', 
                    padding: '15px', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Nhãn giảm giá */}
                    {sp.gia_km && sp.gia_km < sp.gia && (
                      <div style={{ 
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#ff0000',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 3
                      }}>
                        Giảm {Math.round(((sp.gia - sp.gia_km) / sp.gia) * 100)}%
                      </div>
                    )}
                    
                    {/* Nút thêm vào giỏ hàng */}
                    <div style={{ 
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 3,
                      width: '30px',
                      height: '30px',
                      background: '#ffffff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }} onClick={() => xuli(sp)}>
                      <i className="bi bi-bag-plus-fill" style={{ color: '#2196f3' }}></i>
                    </div>
                    
                    {/* Ảnh sản phẩm */}
                    <div style={{ 
                      height: '150px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px'
                    }}>
                      <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                        <img 
                          src={sp.hinh} 
                          alt={sp.ten_sp} 
                          style={{ 
                            maxWidth: '100%',
                            maxHeight: '130px',
                            objectFit: 'contain'
                          }} 
                        />
                      </Link>
                    </div>
                    
                    {/* Tên sản phẩm */}
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      height: '40px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <Link to={`/sanpham/${sp.id}/${sp.id_loai}`} style={{ 
                        color: '#333',
                        textDecoration: 'none'
                      }}>
                        {sp.ten_sp}
                      </Link>
                    </div>
                    
                    {/* Giá */}
                    <div style={{ 
                      color: '#ff0000',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {parseFloat(sp.gia_km || sp.gia).toLocaleString("vi")}₫
                    </div>
                    
                    {/* Giá gốc */}
                    {sp.gia_km && sp.gia_km !== sp.gia && (
                      <div style={{ 
                        color: '#999',
                        fontSize: '12px',
                        textDecoration: 'line-through'
                      }}>
                        {parseFloat(sp.gia).toLocaleString("vi")}₫
                      </div>
                    )}
                    
                    {/* Nút so sánh */}
                    <div style={{ 
                      marginTop: '10px',
                      textAlign: 'center'
                    }}>
                      <button 
                        onClick={() => themSoSanhVaChuyenTrang(sp)} 
                        style={{ 
                          background: '#2196f3',
                          color: 'white',
                          border: 'none',
                          padding: '5px 15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        So sánh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>

      {/* Banner giống Home.js */}
      <div className="carousel-inner" style={{ padding: '10px', marginTop: '30px' }}>
        <div className="carousel-item active">
          <img src={banner_n1} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt="Banner 1" />
        </div>
        <div className="carousel-item">
          <img src={banner5} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt="Banner 2" />
        </div>
        <div className="carousel-item">
          <img src={banner_n1} style={{ width: '1200px', height: '170px', borderRadius: '10px' }} className="d-block w-100" alt="Banner 3" />
        </div>
      </div>

      {/* Box sản phẩm tương tự Home.js */}
      <div className="box_titile_Home" style={{ marginTop: '30px' }}>
        <div className="titile_SP">
          <h2>SẢN PHẨM ĐỀ XUẤT</h2>
          <hr className="h_r"></hr>
        </div>
      </div>
      <div className="tong_box_SP">
        {Array.isArray(listsp) && listsp.slice(0, 4).map((sp, i) => (
          <div className="box_SP" key={i}>
            {sp.phan_tram_gg && (
              <div className="box_SP_khuyen_mai">
                Giảm {sp.phan_tram_gg}%
              </div>
            )}
            <div className="box_SP_anh">
              <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                <img src={sp.hinh} title={sp.ten_sp.toUpperCase()} alt={sp.ten_sp} />
              </Link>
            </div>
            <div className="cart_icon" onClick={() => xuli(sp)}>
              <i className="bi bi-bag-plus-fill"></i>
            </div>
            <div className="box_SP_tensp">
              <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>{sp.ten_sp}</Link>
            </div>
            <div className="box_SP_RAM_SSD">
              {sp.ram && <div><button className="box_SP_RAM">RAM: {sp.ram}</button></div>}
              {sp.dia_cung && <div><button className="box_SP_SSD">SSD: {sp.dia_cung}</button></div>}
            </div>
            <div className="box_SP_gia">
              <div className="box_SP_gia_km" style={{color: '#ff0000', fontWeight: 'bold'}}>
                {parseFloat(sp.gia_km || sp.gia).toLocaleString("vi")} VNĐ
              </div>
              <div className="box_SP_gia_goc" style={{color: '#999'}}>
                <del>{parseFloat(sp.gia).toLocaleString("vi")} VNĐ</del>
              </div>
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
              <div className="so_sanh">
                <button className="so_sanh_btn" onClick={() => themSoSanhVaChuyenTrang(sp)}>
                  So sánh
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SPXemNhieu;
