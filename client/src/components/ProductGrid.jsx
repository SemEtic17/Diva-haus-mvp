import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { getProducts } from '../api'; 
import { useTranslation } from 'react-i18next';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Only fetch on mount

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-foreground/80 font-medium mb-2">{t('products.error', 'Failed to load products. Please try again later.')}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-gold hover:text-gold-light underline underline-offset-4 transition-colors"
        >
          {t('products.try_again', 'Try Again')}
        </button>
      </div>
    );
  }

  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20">
      {/* Background luxury orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-pink/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-3 block">{t('products.collection', 'Curated Collection')}</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">{t('products.featured', 'Featured Pieces')}</h2>
            <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.div>
        </div>

        <div className="relative">
          {/* Glass backdrop */}
          <div className="absolute -inset-4 md:-inset-6 lg:-inset-8 rounded-3xl bg-glass-bg/20 backdrop-blur-sm border border-glass-border/20 -z-10" />
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} variants={itemVariants} className="relative flex justify-center">
                    <ProductSkeleton />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="loaded"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8"
              >
                {products.map((product) => (
                  <motion.div 
                    key={product._id} 
                    variants={itemVariants} 
                    className="relative flex justify-center"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-12 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-neon-cyan/50" />
            <div className="w-2 h-2 rounded-full bg-gold/60" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-neon-pink/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;
