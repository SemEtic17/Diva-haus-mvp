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
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
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
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <svg className="h-10 w-10 animate-spin text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p className="text-muted-foreground">{error}</p>
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
            <span className="text-gold text-sm font-medium tracking-[0.3em] uppercase mb-3 block">Curated Collection</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">Featured Pieces</h2>
            <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </motion.div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative">
          {/* Glass backdrop */}
          <div className="absolute -inset-4 md:-inset-6 lg:-inset-8 rounded-3xl bg-glass-light/30 backdrop-blur-sm border border-glass-border/20 -z-10" />
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8">
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariants} className="relative flex justify-center">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-pink/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />               
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>

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