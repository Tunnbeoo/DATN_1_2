import React, { useState, useEffect } from "react";
import HienSPTrongMotTrang from './HienSPTrongMotTrang'; // Đảm bảo đường dẫn đúng

function Laptop() {
    const [listsp, ganListSP] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/sp/1")
            .then((res) => res.json())
            .then((data) => ganListSP(data))
            .catch((error) => console.error("Lỗi khi tải sản phẩm:", error));
    }, []);

    return (
        <div>
            {/* Các phần khác như tiêu đề hoặc bộ lọc nếu có */}
            <HienSPTrongMotTrang spTrongTrang={listsp} />
        </div>
    );
}

export default Laptop;