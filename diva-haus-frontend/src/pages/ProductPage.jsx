import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, addToCart } from '../api';
import { AuthContext } from '../context/AuthContext';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    try {
      await addToCart(product._id, 1);
      alert('Added to cart');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <img src={product.image} alt={product.name} className="w-1/2 mx-auto" />
      <h2 className="text-3xl font-bold mt-4">{product.name}</h2>
      <p className="text-xl mt-2">${product.price}</p>
      <button
        onClick={handleAddToCart}
        disabled={!user}
        className="bg-blue-500 text-white p-2 rounded mt-4 disabled:bg-gray-400"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPage;
