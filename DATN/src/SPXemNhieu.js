import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function TitleH2() {
  return (
    <div className="titile_SP">
      <h3>SẢN PHẨM HOT THÁNG 6</h3>
      <hr className="h_r" style={{ marginLeft: "-1px" }} />
    </div>
  );
}

function SPXemNhieu() {
  const [listsp, setListSP] = useState([]);
  const [sotin, setXemNhieu] = useState(11);

  useEffect(() => {
    fetch("http://localhost:3000/sphot")
      .then((res) => res.json())
      .then((data) => setListSP(data));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Hiển thị 4 sản phẩm trên desktop
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3, // Tablet: 3 sản phẩm
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Mobile lớn: 2 sản phẩm
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // Mobile nhỏ: 1 sản phẩm
        },
      },
    ],
  };

  return (
    <div className="box_spxn">
      <TitleH2 />
      <Slider {...settings}>
        {listsp
          .sort((a, b) => b.luot_xem - a.luot_xem)
          .slice(0, sotin)
          .map((spxn) => (
            <div className="sp" key={spxn.id_sp}>
              <Link to= {`/sanpham/${spxn.id}/${spxn.id_loai}`} activeClassName="a"><img className="hinh_spxn" src={spxn.hinh} title={(spxn.ten_sp).toLocaleUpperCase()} alt={spxn.ten_sp} /></Link>
              <div>
                <p className="text_tensp">
                  <Link to={`/sanpham/${spxn.id}/${spxn.id_loai}`} className="text_tensp">
                    {spxn.ten_sp}
                  </Link>
                </p>
                <p className="gia">{parseFloat(spxn.gia).toLocaleString("vi")} VNĐ</p>
              </div>
              <div>
                <button type="button" className="btn position-relative">
                  <i className="bi bi-eye-fill"></i>
                  <strong className="text"> {spxn.luot_xem} </strong>
                </button>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}

export default SPXemNhieu;
