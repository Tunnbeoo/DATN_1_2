// admin_category_Sua.js
import { useState, useEffect } from "react";

function AdminCategorySua({ setRefresh, category }) {
    const [loai, setLoai] = useState({
        ten_loai: '',
        img_loai: '',
        slug: '',
        thu_tu: '',
        an_hien: 1
    });

    useEffect(() => {
        if (category) setLoai(category);
    }, [category]);

    const xuliInput = (e) => {
        const { id, value } = e.target;
        setLoai(prev => ({ ...prev, [id]: value }));
    };

    const xuliRadio = (e) => {
        setLoai(prev => ({ ...prev, an_hien: parseInt(e.target.value) }));
    };

    const submitDuLieu = () => {
        fetch(`http://localhost:3000/admin/category/${loai.id}`, {
            method: "PUT",
            body: JSON.stringify(loai),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                alert(data.thongbao);
                setRefresh(prev => !prev);
            });
            setThongBao(true);
            setTimeout(() => {
            setThongBao(false);
        }, 2000);
    };
    const [thongBao, setThongBao] = useState(false);

    return (
        <div>
            {thongBao && (
                        <div className="thongbao" >
                            sửa danh mục thành công!
                        </div>
            )}
        <div className="modal fade" id="modalSua">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Sửa Danh Mục</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <input type="text" id="ten_loai" value={loai.ten_loai} onChange={xuliInput} placeholder="Tên danh mục" />
                        <input type="text" id="img_loai" value={loai.img_loai} onChange={xuliInput} placeholder="Hình ảnh" />
                        <input type="text" id="slug" value={loai.slug} onChange={xuliInput} placeholder="Slug" />
                        <input type="number" id="thu_tu" value={loai.thu_tu} onChange={xuliInput} placeholder="Thứ tự" />
                        <input type="radio" name="an_hien" value="0" checked={loai.an_hien === 0} onChange={xuliRadio} /> Ẩn
                        <input type="radio" name="an_hien" value="1" checked={loai.an_hien === 1} onChange={xuliRadio} /> Hiện
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

export default AdminCategorySua;