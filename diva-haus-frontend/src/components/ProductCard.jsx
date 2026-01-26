import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from './Toaster';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addItemToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (product.isSoldOut) return;

    setIsAdding(true);
    try {
      await addItemToCart(product._id);
    } catch (error) {
      console.error(error.message || 'Could not add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from Wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to Wishlist');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    },
  };

  const imageHover = { scale: 1.08 };
  const cardHover = { scale: 1.03, y: -8 };
  const tapAnimation = { scale: 0.97 };
  const isWishlisted = isInWishlist(product._id);

  return (
    <motion.div
      onClick={handleNavigate}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={cardHover}
      whileTap={tapAnimation}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl 
                 bg-card/40 backdrop-blur-xl
                 border border-glass-border/30
                 shadow-luxury
                 hover:shadow-luxury-hover
                 transition-shadow duration-500
                 holographic-shimmer
                 cursor-pointer"
    >
      {/* Neon border gradient overlay */}
      <div className="absolute inset-0 rounded-2xl p-[1px] pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-pink/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
          {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10 pointer-events-none" />
        
        <motion.img
          src={product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=533&fit=crop'}
          alt={product.name}
          className="h-full w-full object-cover object-center"
          whileHover={imageHover}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Sold Out Badge */}
        {product.isSoldOut && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 left-4 z-20 
                       rounded-full px-4 py-1.5
                       bg-background/80 backdrop-blur-md
                       border border-neon-pink/50
                       shadow-neon-pink"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-neon-pink">
              Sold Out
            </span>
          </motion.div>
        )}

        {/* Wishlist button */}
        <motion.button
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-4 z-20 p-2 bg-background/50 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-colors group/wishlist"
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'text-gold fill-current' : 'text-white'}`}
          />
          <div className="absolute -top-4 right-[41px] translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover/wishlist:opacity-100 transition-opacity whitespace-nowrap">
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </div>
        </motion.button>
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none">
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-lg" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-6">
        {/* Subtle glow effect behind content */}
        <div className="absolute inset-0 bg-gradient-radial from-neon-cyan/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
          <div className="relative z-10 text-center space-y-3">
          {/* Product Name */}
          <h3 
          className="font-serif text-lg sm:text-xl font-medium text-foreground/90 
                       tracking-wide leading-tight line-clamp-2
                       group-hover:text-foreground transition-colors duration-300"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>

          {/* Price */}
          <motion.p 
            className="text-2xl sm:text-3xl font-serif font-semibold text-gradient-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ${product.price.toFixed(2)}
          </motion.p>
        </div>

        {/* Add to Cart Button */}
        <div className="relative z-10 mt-6">
          <motion.button
            onClick={handleAddToCart}
            disabled={isAdding || product.isSoldOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Add ${product.name} to cart`}
            className="w-full min-h-[52px] rounded-xl
                       bg-gradient-to-r from-gold to-gold-dark
                       text-background font-sans font-semibold text-sm
                       tracking-wider uppercase
                       shadow-neon-gold
                       transition-all duration-300
                       hover:shadow-[0_0_30px_hsl(var(--gold)/0.5)]
                       focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-background
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                       relative overflow-hidden group/btn"
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent 
                            translate-x-[-100%] group-hover/btn:translate-x-[100%] 
                            transition-transform duration-700 ease-out" />
            
            {isAdding ? (
              <div className="flex items-center justify-center gap-2">
                <svg 
                  className="h-5 w-5 animate-spin-slow" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="3"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="relative">Adding...</span>
              </div>
            ) : (
              <span className="relative">Add to Cart</span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </motion.div>
  );
};

export default ProductCard;
