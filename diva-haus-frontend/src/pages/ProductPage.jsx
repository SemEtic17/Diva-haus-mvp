import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import VirtualTryOnPlaceholder from '../components/VirtualTryOnPlaceholder';
import HolographicContainer from '../components/HolographicContainer';
import { toast } from '../components/Toaster';
import { isTryOnEnabled } from '../config/features';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, userInfo } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        toast.error('Error fetching product: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }

    try {
      await addItemToCart(product._id, 1);

    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleTryOn = () => {
    if (!isAuthenticated) {
      toast.error('Please login to use virtual try-on.');
      return;
    }

    if (!userInfo || !userInfo.bodyImage) {
      toast.info('Please upload your body image in your profile first for virtual try-on.');
      navigate('/profile');
      return;
    }

    toast.info('Virtual Try-On feature is coming soon!');
  };

  if (loading) {
    return <div className="text-center p-4">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center p-4">Product not found</div>;
  }

  // --- DEBUGGING LOGS ---
  console.log("📦 Product in ProductPage:", product);
  // --- END DEBUGGING LOGS ---

  return (
    <div className="container mx-auto p-4">
      {/* ===================== */}
      {/* 3D HERO SHOWCASE */}
      {/* ===================== */}
      <div className="relative w-full h-[500px] mb-12">
        <HolographicContainer product={product}>
          
        </HolographicContainer>
      </div>

      {/* ===================== */}
      {/* PRODUCT DETAILS */}
      {/* ===================== */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 max-w-md object-cover rounded-lg shadow-md"
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mt-4 md:mt-0">
            {product.name}
          </h2>

          <p className="text-2xl mt-2 text-gray-700">
            ${product.price}
          </p>

          <p className="text-gray-600 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!isAuthenticated}
            className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md disabled:bg-gray-400 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ===================== */}
      {/* VIRTUAL TRY-ON (FEATURE FLAGGED) */}
      {/* ===================== */}
      {isTryOnEnabled && (
        <div className="mt-16">
          <button
            onClick={handleTryOn}
            className="mb-6 w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Virtual Try-On
          </button>

          <VirtualTryOnPlaceholder />
        </div>
      )}
    </div>
  );
};

export default ProductPage;