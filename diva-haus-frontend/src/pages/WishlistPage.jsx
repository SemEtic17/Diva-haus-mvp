import React from 'react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/20 mb-4">
            <Heart className="w-4 h-4 text-neon-pink" />
            <span className="text-sm font-medium text-neon-pink uppercase tracking-widest">{t('wishlist.subtitle', 'Your Favorites')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">{t('wishlist.title')}</h1>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        </header>

        {wishlist.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 backdrop-blur-xl bg-card/40 border border-glass-border/30 rounded-3xl p-12 shadow-luxury max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-foreground mb-4">{t('wishlist.empty')}</h2>
            <p className="text-muted-foreground mb-8">{t('wishlist.empty_desc', 'Start saving your favorite pieces to find them easily later.')}</p>
            <Link to="/" className="inline-flex items-center text-gold font-medium hover:text-gold-light transition-colors group">
              {t('wishlist.browse', 'Browse Collection')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
