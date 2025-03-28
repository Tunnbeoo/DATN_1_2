import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PhanTrang from './PhanTrang';
import Danhmuc from "./danhmuc";
    
function NameOneKind() {
    let { id } = useParams();
        const [loai, listLoai] = useState([]);
        useEffect(() => {
            fetch(`http://localhost:3000/loai/${id}`)
                .then(res =>  res.json())
                .then(data => {listLoai(data);});
        }, [id]);

        return (
            <div id="oneKind" className="titile_SP" style={{marginTop:'100px',marginLeft:'5%'}}>
                <div >
                    <Danhmuc/>
                </div>
                <div >
                    <h2>Sản phẩm thương hiệu <strong>{loai.ten_loai}</strong></h2>
                </div>
                <hr className="h_r" style={{marginLeft:'1px',width:'10%',border:'2px solid #008b8b'}}></hr>
            </div>
        );
}

function ShowProductOneKind() {
    document.title = "Sản phẩm theo loại";
    let { id } = useParams();
    const [spTheoLoai, setSanPhamTrongLoai] = useState([]);
    const [daSapXep, setDaSapXep] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/sptrongloai/${id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSanPhamTrongLoai(data);
                } else {
                    setSanPhamTrongLoai([]);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [id]);

    const sapXepSanPhamHot = () => {
        if (!Array.isArray(spTheoLoai)) return;
        
        const sx = [...spTheoLoai].filter(sp => sp.luot_xem > 500);
        setSanPhamTrongLoai(sx);
        setDaSapXep(true);
    };
    
    const sapXepGiaTang = () => {
        if (!Array.isArray(spTheoLoai)) return;
        
        const sx = [...spTheoLoai].sort((a, b) => {
            // Sắp xếp theo giá khuyến mãi (gia_km), nếu không có thì dùng giá gốc (gia)
            const giaA = parseFloat(a.gia_km || a.gia);
            const giaB = parseFloat(b.gia_km || b.gia);
            return giaA - giaB;
        });
        setSanPhamTrongLoai(sx);
        setDaSapXep(true);
    };
    
    const sapXepGiaGiam = () => {
        if (!Array.isArray(spTheoLoai)) return;
        
        const sx = [...spTheoLoai].sort((a, b) => {
            // Sắp xếp theo giá khuyến mãi (gia_km), nếu không có thì dùng giá gốc (gia)
            const giaA = parseFloat(a.gia_km || a.gia);
            const giaB = parseFloat(b.gia_km || b.gia);
            return giaB - giaA;
        });
        setSanPhamTrongLoai(sx);
        setDaSapXep(true);
    };
    
    return (
        <div>
            <NameOneKind loai={spTheoLoai} />
            <div className='nut_chon_sap_xep'>
                   <h4 id='title' style={{fontWeight:'550',fontSize:'20px'}}>Sắp xếp theo</h4>
                   <div className='nut_chon'>
                       <button style={{marginRight:'10px'}} type="button" className="btn btn-outline-secondary nut_chon_button" onClick={sapXepGiaGiam}><i className="bi bi-sort-down"></i> Giá Khuyến Mãi Cao - Thấp</button>
                       <button style={{marginRight:'10px'}} type="button" className="btn btn-outline-secondary nut_chon_button" onClick={sapXepGiaTang}><i className="bi bi-sort-down-alt"></i> Giá Khuyến Mãi Thấp - Cao</button>
                       <button style={{marginRight:'10px'}} type="button" className="btn btn-outline-secondary nut_chon_button" onClick={sapXepSanPhamHot}><i className="bi bi-eye"></i> Xem nhiều </button>
                   </div>
            </div>
            <PhanTrang listSP={spTheoLoai} pageSize={20} daSapXep={daSapXep} />
            <div className="troVe"><a href="#oneKind"><i className="bi bi-arrow-up-short"></i></a></div>
        </div>
    );
}

export default ShowProductOneKind;
