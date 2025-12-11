import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItemToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    if (product.isSoldOut) return;

    setIsAdding(true);
    try {
      // Assuming addItemToCart returns a promise that resolves on success
      await addItemToCart(product._id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.message || 'Could not add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const imageHover = { scale: 1.1 };
  const cardHover = { scale: 1.02, y: -5 };

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200/60 bg-white shadow-sm"
      whileHover={cardHover}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <motion.img
          src={product.image || 'https://via.placeholder.com/400x533'}
          alt={product.name}
          className="h-full w-full object-cover object-center"
          whileHover={imageHover}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        {product.isSoldOut && (
          <div className="absolute top-4 left-4 rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            Sold Out
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 text-center">
        <div>
          <h3 className="truncate text-base font-medium text-neutral-800" title={product.name}>
            {product.name}
          </h3>
          <p className="mt-2 text-xl font-semibold text-neutral-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <div className="mt-6">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.isSoldOut}
            aria-label={`Add ${product.name} to cart`}
            className="w-full min-h-[44px] rounded-md border border-transparent bg-neutral-800 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isAdding ? (
              <div className="flex items-center justify-center">
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Adding...</span>
              </div>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
