import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectRecentlyViewedProducts } from './redux/recentlyViewedSlice';
import './App.css';

const RecentlyViewedProducts = () => {
  const products = useSelector(selectRecentlyViewedProducts);

  if (!products || products.length === 0) {
    return (
      <div className="recently-viewed-container">
        <p>Chưa có sản phẩm nào được xem gần đây</p>
      </div>
    );
  }

  return (
    <div className="recently-viewed-container">
      <h2>Sản phẩm đã xem gần đây</h2>
      <div className="recently-viewed-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/sanpham/${product.id}/${product.id_loai}`}
            className="recently-viewed-item"
          >
            <img src={product.hinh} alt={product.tensp} />
            <h3>{product.tensp}</h3>
            <p className="price">{product.gia.toLocaleString()}đ</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts; 