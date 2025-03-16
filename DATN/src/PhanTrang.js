import { useState } from "react";
import ReactPaginate from 'react-paginate';
import HienSPTrongMotTrang from "./HienSPTrongMotTrang";


function PhanTrang({ listSP, pageSize }) {
    const [fromIndex, setfromIndex] = useState(0);
    const toIndex = fromIndex + pageSize;
    const spTrong1Trang = listSP.slice(fromIndex, toIndex);
    const tongSoTrang = Math.ceil(listSP.length / pageSize);
    const chuyenTrang = (event) => {
      const newIndex = (event.selected * pageSize) % listSP.length;
      setfromIndex(newIndex);
    };
    return (
     <div> <HienSPTrongMotTrang spTrongTrang={spTrong1Trang} />
     <div style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
     <ReactPaginate nextLabel=">" previousLabel="<" pageCount={tongSoTrang} 
        pageRangeDisplayed={5} onPageChange={chuyenTrang} className="thanhphantrang" 
    />
     </div>
     </div>);
  }//PhanTrang
  

export default PhanTrang;