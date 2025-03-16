import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Danhmuc() {
    const [listLoai, ganListLoai] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/loai")
            .then(res => {return res.json();})
            .then(data => ganListLoai(data));
    }, []);

    return (
        <div className="box_Danhmuc_SP">
            {listLoai.slice(0, 10).map((sp, i) => (
                <div key={i} className="box_danhmuc_img_text">
                    <Link to={`/loai/${sp.id}`}>
                        <div className="Danhmuc_Text">{sp.ten_loai}</div>
                    </Link>
                </div>
                
            ))}
        </div>
    );
}

export default Danhmuc;


