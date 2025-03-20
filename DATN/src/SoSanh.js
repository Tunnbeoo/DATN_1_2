import { useSelector, useDispatch } from "react-redux";
import { xoaKhoiSoSanh } from "./compareSlice";
import { Link } from "react-router-dom";

function SoSanh() {
    // const state = useSelector((state) => state);
    // console.log("🔍 Redux State:", useSelector(state => state));
    const dispatch = useDispatch();
    // Cách an toàn để lấy danhSachSoSanh mà không bị lỗi
    const danhSachSoSanh = useSelector((state) => state.compare?.danhSachSoSanh || []);
    

    console.log("✅ Danh sách so sánh:", danhSachSoSanh);

    return (
        <div>
            <h2>Danh sách sản phẩm so sánh</h2>
            {danhSachSoSanh.length === 0 ? (
                <p>Chưa có sản phẩm nào trong danh sách so sánh.</p>
            ) : (
                <div>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>CPU</th>
                                <th>RAM</th>
                                <th>SSD</th>
                                <th>Giá</th>
                                <th>Màu</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {danhSachSoSanh.map((sp) => (
                                <tr key={sp.id}>
                                    <td><img src={sp.hinh} alt={sp.ten_sp} width="100" /></td>
                                    <td>{sp.ten_sp}</td>
                                    <td>{sp.cpu}</td>
                                    <td>{sp.ram}</td>
                                    <td>{sp.dia_cung}</td>
                                    <td>{parseFloat(sp.gia_km).toLocaleString("vi")} VNĐ</td>
                                    <td>{sp.mau_sac}</td>
                                    <td>
                                        <button onClick={() => dispatch(xoaKhoiSoSanh(sp.id))}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link to="/">Quay lại trang chính</Link>
                </div>
            )}
        </div>
    );
}

export default SoSanh;
