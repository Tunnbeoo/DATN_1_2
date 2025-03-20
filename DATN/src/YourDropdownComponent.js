import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProductsFromLocalStorage } from '../redux/recentlyViewedSlice';

function YourDropdownComponent() {
    const dispatch = useDispatch();
    const recentlyViewedProducts = useSelector(state => state.recentlyViewed.products);

    useEffect(() => {
        dispatch(loadProductsFromLocalStorage());
    }, [dispatch]);

    console.log('Recently viewed products in component:', recentlyViewedProducts);

    return (
        <div className="dropdown">
            {recentlyViewedProducts.length > 0 ? (
                <ul>
                    {recentlyViewedProducts.map(product => (
                        <li key={product.id}>{product.name}</li>
                    ))}
                </ul>
            ) : (
                <p>Chưa có sản phẩm nào được xem gần đây</p>
            )}
        </div>
    );
}

export default YourDropdownComponent; 