import { Link, useNavigate } from "react-router-dom";
import { themVaoSoSanh } from "./compareSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { themSP } from "./cartSlice";

function Laptop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const daDangNhap = useSelector((state) => state.auth.daDangNhap);
  const danhSachSoSanh = useSelector((state) => state.compare.danhSachSoSanh);
  const [listsp, ganListSP] = useState([]);
  const [thongBao, setThongBao] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/sp/1")
      .then((res) => res.json())
      .then((data) => ganListSP(data))
      .catch((error) => console.error("Lỗi khi tải sản phẩm:", error));
  }, []);

  const sapXepGiaTang = () => {
    const sx = [...listsp].sort((a, b) => (parseFloat(a.gia) || 0) - (parseFloat(b.gia) || 0));
    ganListSP(sx);
  };

  const sapXepGiaGiam = () => {
    const sx = [...listsp].sort((a, b) => (parseFloat(b.gia) || 0) - (parseFloat(a.gia) || 0));
    ganListSP(sx);
  };

  const xuli = (sanpham) => {
    if (!daDangNhap) {
      if (window.confirm("Đăng nhập để thêm sản phẩm vào giỏ hàng!")) {
        navigate("/login");
        return;
      }
    }
    dispatch(themSP(sanpham));
    setThongBao(true);
    setTimeout(() => setThongBao(false), 2000);
  };

  const themSoSanhVaChuyenTrang = (sanpham) => {
    console.log("🔍 Sản phẩm thêm vào so sánh:", sanpham);
    dispatch(themVaoSoSanh(sanpham));

    setThongBao(true);
    setTimeout(() => {
      setThongBao(false);
      navigate("/so-sanh");
    }, 1000);
  };

  return (
    <div>
      {thongBao && <div className="thongbao">Sản phẩm đã được thêm!</div>}

      <div className="troVe">
        <a href="#header">
          <i className="bi bi-arrow-up-short"></i>
        </a>
      </div>

      <div className="box_titile_Home">
        <div className="titile_SP">
          <h2>Tất cả sản phẩm</h2>
          <hr className="h_r"></hr>
        </div>

        <div className="box_chucnang_loc_home">
          <label style={{ marginRight: "5px", padding: "5px", fontWeight: "700", fontSize: "15px" }}>
            LỌC:
          </label>
          <select
            style={{
              width: "220px",
              padding: "3px",
              borderRadius: "2px",
              border: "1px solid gray",
              fontSize: "15px",
            }}
            onChange={(e) => {
              if (e.target.value === "2") sapXepGiaTang();
              else if (e.target.value === "3") sapXepGiaGiam();
            }}
          >
            <option value="1">Các chức năng:</option>
            <option value="2">Giá thấp đến cao</option>
            <option value="3">Giá cao đến thấp</option>
            <option value="4">Sản phẩm được quan tâm</option>
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

export default Laptop;
