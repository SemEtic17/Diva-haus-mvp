import React from 'react';
import ThreeScene from '../three/ThreeScene';
import HoloPedestal from '../three/HoloPedestal';
import MannequinModel from '../three/MannequinModel';
import GlassCube from '../three/GlassCube';
import WireframeGrid from '../three/WireframeGrid';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const HolographicContainer = ({ children, product, comingSoon = true }) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background rounded-3xl border border-glass-border/20 shadow-inner group">
      {comingSoon && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[2px] text-foreground p-6 sm:p-12 text-center"
             style={{ pointerEvents: 'none' }}> 
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-2">
              <span className="text-xs font-bold text-gold uppercase tracking-[0.3em]">{t('products.coming_soon')}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2 text-foreground tracking-tight">{t('products.three_d_preview')}</h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm md:text-base">
              {t('products.three_d_preview_desc', 'Experience the texture and form of our exclusive pieces in a fully interactive 3D digital showroom.')}
            </p>
          </motion.div>
        </div>
      )}

      <ThreeScene>
        <HoloPedestal position={[0, 0, 0]} />
        <MannequinModel key={product?._id} product={product} position={[0, 0.05, 0]} />
        <GlassCube size={2.8} />
        <WireframeGrid position={[0, 0, 0]} />
      </ThreeScene>
      
      <div
        className="absolute inset-0 z-10 p-4 w-full h-full flex items-center justify-center text-center"
        style={{ pointerEvents: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

export default HolographicContainer;
