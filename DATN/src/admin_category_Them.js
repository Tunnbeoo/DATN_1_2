import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminCategoryThem({ setRefresh }) {
    const [loai, setUs] = useState({
        ten_loai: '',
        img_loai: '',
        slug: '',
        thu_tu: '',
        an_hien: 1 // Default to "Hiện"
    });

    const navigate = useNavigate();

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setUs(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const xuliRadio = (e) => {
        const { value } = e.target;
        setUs(prev => ({
            ...prev,
            an_hien: parseInt(value)
        }));
    };
    const [thongBao, setThongBao] = useState(false);
    const submitDuLieu = () => {
        let url = `http://localhost:3000/admin/category`;
        let otp = {
            method: "post",
            body: JSON.stringify(loai),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch(url, otp)
            .then(res => res.json())
            .then(data => {
                alert(data.thongbao);
                setUs({
                    ten_loai: '',
                    img_loai: '',
                    slug: '',
                    thu_tu: '',
                    an_hien: 1 // Reset to default "Hiện"
                });
                
                setRefresh(prev => !prev);
                navigate('/admin/category');
            });
            setThongBao(true);
        setTimeout(() => {
            setThongBao(false);
        }, 2000);
    };

    return (
        <div>
            {thongBao && (
                        <div className="thongbao" >
                            loai Sản phẩm đã được thêm!
                        </div>
            )}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
            <div className="modal-dialog modal-xl">
                <div className="modal-content" style={{ height: '800px' }}>
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ fontWeight: '600', color: "black" }}>Thêm Danh Mục</h1>
                         <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body" style={{ marginTop: '-100px' }}>
                        <form style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="ten_loai" className="col-form-label">Tên danh mục</label>
                                    <input type="text" className="form-control" id="ten_loai" value={loai.ten_loai} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="img_loai" className="col-form-label">Hình</label>
                                    <input type="text" className="form-control" id="img_loai" value={loai.img_loai} onChange={xuliInput} />
                                </div>
                            </div>
                            <div style={{ margin: '10px' }}>
                                <div className="mb-3">
                                    <label htmlFor="slug" className="col-form-label">Slug</label>
                                    <input type="text" className="form-control" id="slug" value={loai.slug} onChange={xuliInput} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="thu_tu" className="col-form-label">Thứ tự</label>
                                    <input type="number" className="form-control" id="thu_tu" value={loai.thu_tu} onChange={xuliInput} />
                                </div>
                            </div>
                            <div style={{ margin: '10px',marginTop:"-80%", display: "grid", gridTemplateColumns: "50% 50%" }}>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="an_hien" id="an" value="0" checked={loai.an_hien === 0} onChange={xuliRadio} />
                                    <label className="form-check-label" htmlFor="an">Ẩn</label>
                                </div>
                                <div className="form-check" style={{ marginLeft: '-180px' }}>
                                    <input className="form-check-input" type="radio" name="an_hien" id="hien" value="1" checked={loai.an_hien === 1} onChange={xuliRadio} />
                                    <label className="form-check-label" htmlFor="hien">Hiện</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" style={{backgroundColor: '#6c757d'}} className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" style={{backgroundColor: '#0d6efd'}} className="btn btn-primary" onClick={(e) => submitDuLieu(e)}>Xác nhận</button>
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    );
}

export default AdminCategoryThem;
