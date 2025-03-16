

import anh4 from './img/anh4.png';
import outdatew from './img/outdated.webp';
import anh1 from './img/anh1.png';
import anh2 from './img/anh2.png';
import cart from './img/xe.webp';
import phieugiam from './img/phieugiam.webp'
import qua from './img/qua.webp';
import camket from './img/camket.webp';
import nganhang from './img/footer_trustbadge.webp' 
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// xử lí giỏ hàng
import { useDispatch } from 'react-redux';
import { themSP } from './cartSlice';

function ProductDetail () {
    document.title="Chi tiết sản phẩm"
    const dispatch = useDispatch();
    let { id,id_loai } = useParams();
    const [sp, setSanPham] = useState([]);//khai báo biến state có tên sp
    const [sanPhamNgauNhien, setSanPhamNgauNhien] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:3000/sp/${id}/${id_loai}`)
            .then(res => res.json())
            .then(data => { setSanPham(data); });
    }, [id,id_loai]);

    useEffect(() => {
        fetch(`http://localhost:3000/sptrongloai/${id_loai}`)
            .then(res => res.json())
            .then(data => {
                const randomProducts = [];
                while (randomProducts.length < 4 && data.length > 0) {
                    const index = Math.floor(Math.random() * data.length);
                    const randomProduct = data[index];
                    if (!randomProducts.includes(randomProduct)) {
                        randomProducts.push(randomProduct);
                    }
                }
                setSanPhamNgauNhien(randomProducts);
            });
    }, [id_loai]);

    const [thongBao, setThongBao] = useState(false);
    const xuli = (sanpham) => {
        dispatch(themSP(sanpham));
        setThongBao(true);
        setTimeout(() => {
            setThongBao(false);
        }, 2000);
    };
    return (
        <div id="ctsp">
                 {thongBao && (
                        <div className="thongbao" >
                            Sản phẩm đã được thêm!
                        </div>
                    )}
           <div
              style={{marginBottom: '100px', marginTop:'7%'}}>
                <div id="productDetail" style={{display: 'flex',marginTop: '20px',marginLeft: '10px'}}>
                    <div><a style={{fontSize: '17px',color: 'rgb(169, 169, 169)',textDecoration: 'none',marginRight: '10px'}} href="/">Trang chủ /</a></div>
                    <div><a style={{fontSize: '17px',color: 'rgb(169, 169, 169)',textDecoration: 'none',marginRight: '10px'}} href="#/"> Chi tiết sản phẩm /</a></div>
                    <div id="tenSP"><a style={{fontWeight: '600',fontSize: '17px',color: '#fdb813',textDecoration: 'none'}} href="#/">{sp.slug}</a></div>
                </div><br/>
                <div className="box_row">
                    <div className=" box_sub sub_row1" >
                        <div className="col hinh_img"><img className="img" src={sp.hinh} alt={sp.hinh} /></div>
                        <div className="small"> 
                            <div className="img_small" >
                                <img src={sp.hinh} alt={sp.hinh} />
                                <img src={sp.hinh} alt={sp.hinh}/>
                            </div>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'auto auto', justifyContent:'center',alignItems:'center'}}>
                            <div style={{marginRight: '10px',fontWeight: '600'}}>Chia sẻ:</div>
                            <div style={{display: 'flex',cursor: 'pointer'}}>
                                <div><i style={{fontSize: '30px',color: '#fff',background: '#4267b2',borderRadius: '50%',marginRight: '10px'}} className="bi bi-facebook"></i></div>
                                <div> <i style={{fontSize: '32px',color: '#fff',background: '#e60023',borderRadius: '50%',marginRight: '10px'}}  className="bi bi-pinterest"></i></div>
                                <div><button style={{border: '1px solid #77c7f7',background: '#77c7f7',borderRadius: '50%',padding: '4px',cursor: 'pointer',width:'38px', marginTop:'5px'}}><i style={{fontSize: '17px',color: '#fff'}} class="bi bi-twitter"></i></button></div>
                            </div>
                        </div>
                        <div style={{textAlign: 'center',display:'grid',justifyContent:'center'}}>
                            <h3 style={{fontSize:'30px',marginTop:'20px'}}>Mô tả chi tiết sản phẩm!!</h3>
                            <hr style={{border: '1.4px solid rgb(174, 174, 174)',width: '40%',marginTop:'-5px',marginLeft:'28%'}}/>
                            <p style={{}}>Bảo hành 24 tháng chính hãng (Máy, Sạc: 24 tháng, Pin: 12 tháng)</p>
                            <p style={{}}>Đổi mới sản phẩm trong 15 ngày</p>
                            <p style={{}}>Tình trạng: Mới 100%</p>
                            <p style={{}}>Nguyên hộp, đầy đủ phụ kiện từ nhà sản xuất: Dây nguồn; Sách hướng dẫn; Sạc Laptop</p>
                        </div>
                    </div>
                    <div className=" box_sub sub_row2">
                        <div className="col border_bt" >
                            <div className="ten_text">{sp.ten_sp}</div>
                            <div style={{marginTop: '5px',fontSize:'15px'}}>Tình trạng: <a href="#/" style={{color: '#C0C0C0'}}>Còn hàng</a>   |   Mã SKU: <a href="#/" style={{color: '#C0C0C0'}}>Đang cập nhật</a></div>
                            <hr className="hr_ct" />
                        </div>
                        <div className="col ">
                            <div className="price_content">
                                <div><h2>{parseFloat(sp.gia_km).toLocaleString("vi")} VNĐ</h2></div>
                                <div><del>{parseFloat(sp.gia).toLocaleString("vi")}VNĐ</del></div>
                                <div className="btn_gg"><button>-{Math.round(((sp.gia - sp.gia_km) / sp.gia) * 100)}%</button></div> 
                            </div>
                            <div className="box_banner">
                                <div className="banner">
                                <div className="text_ct">
                                    <h4>ƯU ĐÃI HOT, ĐỪNG BỎ LỠ!!</h4>
                                    <p>Sản phẩm sẽ trở về giá gốc khi hết giờ</p>
                                </div>
                                <div className="countdown">
                                    <div className="box_cd"><div id="hours">03 </div><a href="#/">giờ</a></div>
                                    <div className="box_cd"><div id="minutes">00 </div><a href="#/">phút</a></div>
                                    <div className="box_cd"><div id="seconds">00 </div><a href="#/">giây</a></div>
                                </div>
                                </div>
                                <div className="tt_sp">
                                    <strong>243</strong> sản phẩm đã bán
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-bar-fill"></div>
                                </div>
                
                            </div>
                        </div>
                        <div className="col">
                            <div className="chon_sl">
                                <div className="text_sl">Số lượng: </div>
                                <div><button>-</button></div>
                                        <div style={{color: 'black'}}>1</div>
                                <div><button>+</button></div>
                            </div>
                            <div className="mua_them_btn"> 
                                <div><button className="mt_btn1">Mua Ngay</button></div>
                                <div className='add_SP' onClick={() => xuli(sp)}><button className="mt_btn2">Thêm vào giỏ hàng</button></div>
                            </div>
                            <div style={{paddingTop: '20px'}}> 
                                <div style={{fontSize: '20px',fontFamily: 'Arial, Helvetica, sans-serif',fontWeight: '400'}}><strong>Phương thức thanh toán</strong></div><br/>
                                <div style={{cursor:'pointer',transform:'translateX(-20px)'}}><img src={nganhang} alt={nganhang} /></div>
                            </div>
                            <hr style={{border: '1px solid rgb(239, 239, 239)',marginTop: '15px'}} />
                        </div>
                        <div className="">
                            <div className="content_img">
                                <div>
                                <div><img src={cart} alt={cart} />Giao hàng toàn quốc</div>
                                <div><img src={phieugiam} alt={phieugiam} />Giảm 5% khi thanh toán online</div>
                                </div>
                                <div>
                                <div><img src={qua} alt={qua} />Tích điểm tất cả sản phẩm</div>
                                <div><img src={camket} alt={camket} />Cam kết chính hãng</div>
                                </div>
                            </div>
                
                        </div>
                        
                    </div>
                    <div className=" box_sub sub_row3">
                        <div className="bc_phieu">
                            <div className="box_phieu_gg">
                                <div className="phieu_gg">
                                    <div className="box_img_pgg"><img src={anh4} style={{width:'60px', height:'50px'}} alt={anh4} /></div>
                                    <div className="box_content_pgg">
                                        <a href="#/" style={{color: '#149b9b',fontWeight: '600'}}>NHẬN MÃ: EGA10</a>
                                        <p style={{fontSize: '13px',color: 'rgb(157, 157, 157)',marginTop: '-3px'}}>Mã giảm 10% cho đơn tối thiểu 100k.</p>
                                        <div style={{display: 'flex'}}>
                                        <div style={{marginTop: '-20px',fontSize:'12px',fontWeight:'650'}}>
                                            <p>Mã: EGA10</p>
                                            <p style={{transform:'translateY(-20px)'}}>HSD: 31/12/2023</p>
                                        </div>
                                        <div style={{marginLeft: '30px'}}><img src={outdatew} style={{width: '45px', height:'38px',transform:'translateY(-20px)'}} alt={outdatew} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                
                            <div className="box_phieu_gg">
                                <div className="phieu_gg">
                                    <div className="box_img_pgg"><img src={anh1} style={{width:'60px', height:'50px'}} alt={anh1} /></div>
                                    <div className="box_content_pgg">
                                    <a href="#/" style={{color: '#149b9b',fontWeight: '600'}}>NHẬN MÃ: EGA50</a>
                                    <p style={{fontSize: '13px',color: 'rgb(157, 157, 157)',marginTop: '-3px'}}>Mã giảm 10% cho đơn tối thiểu 100k.</p>
                                    <div style={{display: 'flex'}}>
                                        <div style={{marginTop: '-20px',fontSize:'12px',fontWeight:'650'}}>
                                        <p>Mã: EGA10</p>
                                        <p style={{transform:'translateY(-20px)'}}>HSD: 08/07/2023</p>
                                        </div>
                                        <div style={{marginLeft: '30px'}}><img src={outdatew} style={{width: '45px', height:'38px',transform:'translateY(-20px)'}} alt={outdatew} /></div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                
                            <div className="box_phieu_gg">
                            <div className="phieu_gg">
                                <div className="box_img_pgg"><img src={anh2} style={{width:'60px', height:'50px'}} alt={anh2} /></div>
                                <div className="box_content_pgg">
                                    <a href="#/" style={{color: '#149b9b',fontWeight: '600'}}>NHẬN MÃ: EGA99K</a>
                                    <p style={{fontSize: '13px',color: 'rgb(157, 157, 157)',marginTop: '-3px'}}>Mã giảm 10% cho đơn tối thiểu 100k.</p>
                                    <div style={{display: 'flex'}}>
                                    <div style={{marginTop: '-20px',fontSize:'12px',fontWeight:'650'}}>
                                        <p>Mã: EGA10</p>
                                        <p style={{transform:'translateY(-20px)'}}>HSD: 31/10/2023</p>
                                    </div>
                                    <div style={{marginLeft: '30px'}}><img src={outdatew} style={{width: '45px', height:'38px',transform:'translateY(-20px)'}} alt={outdatew} /></div>
                                    </div>
                                </div>
                            </div>
                            </div>
                    
                         

                            <div style={{}}>
                                <h2 style={{fontSize:'22px', fontWeight:'600'}}> Cấu hình máy {sp.ten_sp}</h2>
                                <table class="table">
                                <tbody>
                                    <tr className="table-secondary">
                                        <th scope="row">Bộ xử lí</th>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th style={{fontSize:'15px'}}>Công nghệ CPU:</th>
                                        <td style={{fontSize:'16px'}}>{sp.cpu}</td>
                                    </tr>
                                    <tr className="table-secondary">
                                        <th scope="row">Bộ nhớ RAM, Ổ cứng</th>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th style={{fontSize:'15px'}}>RAM:</th>
                                        <td style={{fontSize:'16px'}}>{sp.ram}</td>
                                    </tr>
                                    <tr>
                                        <th style={{fontSize:'15px'}}>Ổ cứng:</th>
                                        <td style={{fontSize:'16px'}}>{sp.dia_cung}</td>
                                    </tr>
                                    <tr className="table-secondary">
                                        <th scope="row">Khối lượng</th>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th style={{fontSize:'15px'}}>Khối lượng:</th>
                                        <td style={{fontSize:'16px'}}>{sp.can_nang}kg</td>
                                    </tr>
                                    <tr className="table-secondary">
                                        <th scope="row">Ngày</th>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th style={{fontSize:'15px'}}>Ngày sản xuất:</th>
                                        <td style={{fontSize:'16px'}}>{new Date(sp.ngay).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                        </div>
                     

                    </div>
                </div>
          
            </div>
            
            <div style={{display:'grid',justifyContent:'center',marginTop:'-50px',marginBottom:'15px'}}>
                <div className="titile_SP" style={{paddingLeft:'10px',textAlign:'center'}}>
                    <h2>SẢN PHẨM LIÊN QUAN</h2>
                    <hr className="h_r" style={{marginLeft:'42%',width:'15%',border:'2px solidrgb(0, 234, 255)'}}></hr>
                </div>
                <div className="tong_box_SP">
                {sanPhamNgauNhien.map((sp, i) => (
                    <div className="box_SP" key={i}>
                    <div className="box_SP_anh">
                         <Link to= {`/sanpham/${sp.id}/${sp.id_loai}`} activeClassName="a"><img src={sp.hinh} title={(sp.ten_sp).toLocaleUpperCase()} alt={sp.ten_sp} /></Link>
                    </div>
                    <div className="box_SP_tensp"><Link to= {`/sanpham/${sp.id}/${sp.id_loai}`} activeClassName="a">{sp.ten_sp}</Link></div><br/>
                    <div className='add_SP' onClick={() => xuli(sp)}><i class="bi bi-bag-plus-fill"></i></div>
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

            </div>
            <div className="troVe"><a href="#header"><i className="bi bi-arrow-up-short"></i></a></div>
            
        </div>
    );
};

export default ProductDetail;