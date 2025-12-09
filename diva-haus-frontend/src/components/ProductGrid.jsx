import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api'; // Remove addToCart
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // NEW: Import CartContext
import { toast } from '../components/NotificationSystem'; // NEW: Import toast

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext); // NEW: Get addItemToCart from CartContext

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login first'); // NEW: Use toast.error
      return;
    }
    try {
      await addItemToCart(productId, 1);
      // alert('Added to cart'); // CartContext handles alerts/notifications
    } catch (error) {
      // alert(`Error: ${error.message}`); // CartContext handles alerts/notifications
    }
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <Link to={`/product/${product._id}`}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </Link>
          <button
            onClick={() => handleAddToCart(product._id)}
            disabled={!isAuthenticated}
            className="bg-blue-500 text-white p-2 rounded mt-2 disabled:bg-gray-400"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
