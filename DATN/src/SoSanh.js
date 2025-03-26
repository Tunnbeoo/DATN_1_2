import { useSelector, useDispatch } from "react-redux";
import { xoaKhoiSoSanh } from "./compareSlice";
import { Link } from "react-router-dom";
import './main.css';
import './home_sosanh.css';

function SoSanh() {
    const state = useSelector((state) => state);
    console.log("🔍 Redux State:", useSelector(state => state));
    const dispatch = useDispatch();
    // Cách an toàn để lấy danhSachSoSanh mà không bị lỗi
    const danhSachSoSanh = useSelector((state) => state.compare?.danhSachSoSanh || []);
    
    console.log("✅ Danh sách so sánh:", danhSachSoSanh);

    function CompareValue() {
        console.log('CompareValue function called');
    }

    return (
        <ul className="compare-list compare-main">
            <li>
                <p className="compare-title">So sánh sản phẩm</p>
                <div className="compare-products">
                    {danhSachSoSanh.map((sp) => (
                        <p className="compare-product-name" data-id={sp.id} key={sp.id}>{sp.ten_sp}</p>
                    ))}
                </div>
                <div className="compare-detail checkdiff">
                    <div className="compare-diff" onClick={() => CompareValue()}>
                        <i className="icon-tickbox"></i>
                        <span>Chỉ xem điểm khác biệt</span>
                    </div>
                </div>
            </li>
            {danhSachSoSanh.map((sp) => (
                <li key={sp.id} data-id={sp.id} className={`compare-item productid-${sp.id} cate-42`} data-url={`/dtdd/${sp.ten_sp.replace(/\s+/g, '-').toLowerCase()}`}>
                    <div className="compare-delete-icon" onClick={() => dispatch(xoaKhoiSoSanh(sp.id))}>
                        <i className="bi bi-x-lg"></i>
                    </div>
                    <a href={`/dtdd/${sp.ten_sp.replace(/\s+/g, '-').toLowerCase()}`} className="compare-content">
                        <div className="compare-label">
                            <span className="compare-new">Mẫu mới</span>
                            <span className="compare-installment">Trả chậm 0%</span>
                        </div>
                        <div className="compare-img">
                            <img className="compare-thumb" src={sp.hinh} alt={sp.ten_sp} />
                        </div>
                        <p className="compare-result"><img width="20" height="20" alt="label template" src="https://cdn.tgdd.vn/2020/10/content/icon5-50x50.png" /><span>Trả trước 0đ</span></p>
                        <h3>
                            {sp.ten_sp}
                            <span className="compare-new-model">Mẫu mới</span>
                        </h3>
                        <div className="compare-specs">
                            <span>{sp.ram}</span>
                            <span>{sp.dia_cung}</span>
                        </div>
                        <strong className="compare-price">{parseFloat(sp.gia_km).toLocaleString("vi")}₫</strong>
                    </a>
                    <div className="compare-bottom">
                        <a href="javascript:;" className="compare-shipping" aria-label="shipping"></a>
                    </div>
                    <div className="compare-rating">
                        <div className="compare-vote">
                            {[...Array(5)].map((_, index) => (
                                <i key={index} className={`bi ${index < 5 ? 'bi-star-fill' : 'bi-star'}`}></i>
                            ))}
                            <b>5</b>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default SoSanh;
