
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

    useEffect(() => {
        fetch(`http://localhost:3000/sptrongloai/${id}`)
            .then(res => res.json())
            .then(data => setSanPhamTrongLoai(data))
            .catch(error => console.error('Error fetching products:', error));
    }, [id]);
        const sapXepSanPhamHot = () => {
            const sx = [...spTheoLoai].filter(sp => sp.luot_xem > 500);
            setSanPhamTrongLoai(sx);
        };
        const sapXepGiaTang = () => {
            const sx = [...spTheoLoai].sort((a, b) => {
            const giax = parseFloat(a.gia);
            const giay = parseFloat(b.gia);
            return giax - giay;
            });
            setSanPhamTrongLoai(sx);
        };
        const sapXepGiaGiam = () => {
            const sx = [...spTheoLoai].sort((a, b) => {
            const giax = parseFloat(a.gia);
            const giay = parseFloat(b.gia);
            return giay - giax;
            });
            setSanPhamTrongLoai(sx);
        };
    return (
        <div>
            
            <NameOneKind loai={spTheoLoai} />
            <div className='nut_chon_sap_xep'>
                   <h4 id='title' style={{fontWeight:'550',fontSize:'20px'}}>Sắp xếp theo</h4>
                   <div className='nut_chon'>
                       <button style={{marginRight:'10px'}} type="button" className="btn btn-outline-secondary nut_chon_button" onClick={sapXepGiaGiam}><i class="bi bi-sort-down"></i> Giá Cao - Thấp</button>
                       <button style={{marginRight:'10px'}} type="button" className="btn btn-outline-secondary nut_chon_button" onClick={sapXepGiaTang}><i class="bi bi-sort-down-alt"></i> Giá Thấp - Cao</button>
                       <button style={{marginRight:'10px'}} type="button" className="btn btn-outline-secondary nut_chon_button" onClick={sapXepSanPhamHot}><i class="bi bi-eye"></i> Xem nhiều </button>
                   </div>
            </div>
            <PhanTrang listSP={spTheoLoai} pageSize={20} />
            <div className="troVe"><a href="#oneKind"><i className="bi bi-arrow-up-short"></i></a></div>
        </div>
    );
}

export default ShowProductOneKind;
