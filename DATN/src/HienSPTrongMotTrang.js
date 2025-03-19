import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { themSP } from "./cartSlice";
import { themVaoSoSanh } from "./compareSlice"; // Import action so sánh
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function HienSPTrongMotTrang({ spTrongTrang }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [thongBao, setThongBao] = useState(false);

    const xuli = (sanpham) => {
        dispatch(themSP(sanpham));
        setThongBao(true);
        setTimeout(() => setThongBao(false), 3000);
    };

    // const themSoSanh = (sanpham) => {
    //     console.log("Sản phẩm được thêm vào so sánh:", sanpham);
    //     dispatch(themVaoSoSanh(sanpham));
    // };
    const themSoSanhVaChuyenTrang = (sanpham) => {
        console.log("🔍 Sản phẩm thêm vào so sánh:", sanpham);
        dispatch(themVaoSoSanh(sanpham));
        setThongBao(true);
        setTimeout(() => {
            setThongBao(false);
            navigate("/so-sanh"); // Chuyển đến trang so sánh sau khi thêm sản phẩm
        }, 1000);
    };

    return (
        <div className="tong_box_SPL">
        {thongBao && (
                    <div className="thongbao" >
                        Đã thêm vào so sánh
                    </div>
                )}
            {spTrongTrang.map((sp, i) => (
                <div className="box_SPL" key={i}>
                <div className="box_SPL_anh">
                     <img src={sp.hinh} title={(sp.ten_sp).toLocaleUpperCase()} alt={sp.ten_sp} />
                </div>
                <div className="box_SPL_tensp"><Link to= {`/sanpham/${sp.id}/${sp.id_loai}`} routerLinkActive="a">{sp.ten_sp}</Link></div>
                <div className='add_SP' onClick={() => xuli(sp)}><i class="bi bi-bag-plus-fill"></i></div>
                <div className="box_SPL_RAM_SSD">
                    <div><button className="box_SPL_RAM" >RAM: {sp.ram}</button></div>
                    <div><button className="box_SPL_SSD" >SSD: {sp.dia_cung}</button></div>
                </div>
                <div className="box_SPL_gia">
                    <div className="box_SPL_gia_km">{parseFloat(sp.gia_km).toLocaleString("vi")}VNĐ</div>
                    <div className="box_SPL_gia_goc"><del>{parseFloat(sp.gia).toLocaleString("vi")}VNĐ</del></div>
                </div>
                <div className="box_SPL_luot_xem"><p>Lượt xem: {sp.luot_xem}</p></div>
                <div className="box_SPL_icon">
                    <div className="box_SPL_icon_star">
                        <div className="box_SPL_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                        <div className="box_SPL_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                        <div className="box_SPL_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                        <div className="box_SPL_icon_star_dam"><i className="bi bi-star-fill"></i></div>
                        <div className="box_SPL_icon_star_nhat"><i className="bi bi-star-fill"></i></div>
                        <div className="box_SPL_icon_star_dg"><p>(Đánh giá)</p></div>
                
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
    );
}

export default HienSPTrongMotTrang;