import React, { useState, useEffect } from 'react';
import Pagination from 'react-paginate';
import { Link } from 'react-router-dom';
import HienSPTrongMotTrang from "./HienSPTrongMotTrang";

function PhanTrang({ listSP, pageSize, daSapXep }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);

    // Tính toán số trang và thiết lập các item hiển thị trên trang hiện tại
    useEffect(() => {
        if (Array.isArray(listSP) && listSP.length > 0) {
            const pageCount = Math.ceil(listSP.length / pageSize);
            setPageCount(pageCount);
            
            const offset = currentPage * pageSize;
            const currentItems = listSP.slice(offset, offset + pageSize);
            setCurrentItems(currentItems);
        } else {
            setCurrentItems([]);
            setPageCount(0);
        }
    }, [listSP, pageSize, currentPage]);

    // Xử lý sự kiện thay đổi trang
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <div>
            <div className="tong_box_SP">
                {currentItems.map((sp, i) => (
                    <div className="box_SP" key={i}>
                        {sp.phan_tram_gg && (
                            <div className="box_SP_khuyen_mai">
                                Giảm {sp.phan_tram_gg}%
                            </div>
                        )}
                        <div className="box_SP_anh">
                            <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>
                                <img src={sp.hinh} title={sp.ten_sp} alt={sp.ten_sp} />
                            </Link>
                        </div>
                        <div className="box_SP_tensp">
                            <Link to={`/sanpham/${sp.id}/${sp.id_loai}`}>{sp.ten_sp}</Link>
                        </div>
                        <div className="box_SP_gia">
                            <div className="box_SP_gia_km" style={{color: '#ff0000', fontWeight: 'bold'}}>
                                {parseFloat(sp.gia_km || sp.gia).toLocaleString("vi")} VNĐ
                            </div>
                            {sp.gia_km && sp.gia_km !== sp.gia && (
                                <div className="box_SP_gia_goc" style={daSapXep ? {color: '#999'} : {}}>
                                    <del>{parseFloat(sp.gia).toLocaleString("vi")} VNĐ</del>
                                </div>
                            )}
                        </div>
                        <div className="box_SP_luot_xem"><p>Lượt xem: {sp.luot_xem}</p></div>
                    </div>
                ))}
            </div>
            
            <div className="pt_link">
                <Pagination
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    );
}

export default PhanTrang;