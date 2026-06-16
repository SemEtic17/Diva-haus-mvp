import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductGrid from '../components/ProductGrid';
import HeroSection from '../components/HeroSection';
import ValueProp from '../components/ValueProp';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Value Proposition / Virtual Try-On Flow */}
      <ValueProp />

      {/* Featured Collection */}
      <div id="collection" className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground text-center mb-4"
            >
              {t('landing.featured_title', 'The Curated Collection')}
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-gold to-gold-dark"
            />
          </div>
          <ProductGrid />
        </div>
      </div>

      {/* Social / Branding Section */}
      <section className="relative overflow-hidden bg-navy-deep py-24 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neon-pink/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif italic mb-8"
          >
            "Fashion is not just what you wear, it's who you are. Step into your diva era."
          </motion.h3>
          <div className="w-12 h-px bg-gold/50 mx-auto mb-8" />
          <p className="text-white/60 uppercase tracking-[0.4em] text-sm">DIVA HAUS · Est. 2024</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
