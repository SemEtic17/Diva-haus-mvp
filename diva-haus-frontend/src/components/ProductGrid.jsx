import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { getProducts } from '../api'; // Assuming getProducts API function exists

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // In a real app, you'd fetch this from your API
        // const fetchedProducts = await getProducts();
        // setProducts(fetchedProducts);

        // MOCK DATA until API is ready
        const mockProducts = [
          { _id: '1', name: 'Ethereal Gown', price: 250.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: false },
          { _id: '2', name: 'Odyssey Blazer', price: 180.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: false },
          { _id: '3', name: 'Silk Charmeuse Blouse', price: 95.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: true },
          { _id: '4', name: 'Cosmos Trousers', price: 130.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: false },
          { _id: '5', name: 'Celestial Skirt', price: 110.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: false },
          { _id: '6', name: 'Nova Knit Top', price: 75.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: false },
          { _id: '7', name: 'Luna Leather Jacket', price: 320.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: false },
          { _id: '8', name: 'Orion Velvet Dress', price: 280.00, imageUrl: 'https://i.pinimg.com/1200x/54/44/32/544432551193812f7e52c89f44841792.jpg', isSoldOut: false },
        ];
        // Create placeholder image paths in public folder
        console.log("Using mock data. Create a 'public/images' folder and add placeholder images like 'gown.jpg', 'blazer.jpg', etc.");
        setProducts(mockProducts);

      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <svg className="h-8 w-8 animate-spin text-neutral-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </motion.div>
  );
};

export default ProductGrid;