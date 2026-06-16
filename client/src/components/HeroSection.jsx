import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles as SparklesIcon } from 'lucide-react';
import ThreeScene from '../three/ThreeScene';
import LandingHeroThree from '../three/LandingHeroThree';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-background pt-12">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,oklch(var(--gold-lch)/0.05)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-pink/5 rounded-full blur-[120px]" />
      </div>

      {/* Left Content */}
      <div className="relative z-10 w-full lg:w-1/2 px-4 sm:px-8 lg:px-16 flex flex-col items-start text-left space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 shadow-sm"
        >
          <SparklesIcon className="w-4 h-4 text-gold" />
          <span className="text-xs font-bold text-gold uppercase tracking-[0.3em]">
            {t('landing.hero_badge', 'The Future of Fashion')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-foreground leading-[0.85] tracking-tighter"
        >
          <span className="block">DIVA</span>
          <span className="block text-gradient-gold">HAUS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-md text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {t('landing.hero_desc', 'Experience luxury without limits. Our AI Virtual Try-On brings the boutique experience directly to you.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-wrap gap-4 pt-4"
        >
          <motion.a
            href="#collection"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-background font-bold uppercase tracking-widest rounded-full shadow-neon-gold flex items-center gap-3 group"
          >
            {t('landing.explore_collection', 'Explore Collection')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-card border border-glass-border/30 text-foreground font-bold uppercase tracking-widest rounded-full hover:bg-muted transition-colors flex items-center gap-3"
          >
            {t('landing.how_it_works', 'How it Works')}
          </motion.button>
        </motion.div>
      </div>

      {/* Right Visual / 3D Scene */}
      <div className="relative z-10 w-full lg:w-1/2 h-[60vh] lg:h-screen mt-12 lg:mt-0">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-2xl bg-gradient-to-br from-white/5 to-white/10 rounded-[4rem] border border-white/10 shadow-luxury-hover overflow-hidden">
            <ThreeScene orbit={false}>
              <LandingHeroThree />
            </ThreeScene>
            
            {/* Holographic Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 right-8 text-right space-y-1">
                <p className="text-[10px] font-bold text-gold uppercase tracking-[0.5em]">System Status</p>
                <p className="text-[10px] text-neon-cyan font-mono">NEURAL_MESH: ACTIVE</p>
                <p className="text-[10px] text-neon-pink font-mono">RENDER_LATENCY: 12ms</p>
              </div>
              
              <div className="absolute bottom-8 left-8 space-y-1">
                <p className="text-[10px] font-bold text-gold uppercase tracking-[0.5em]">Holographic Engine</p>
                <p className="text-[10px] text-white/40 font-mono">v2.0.4-DIVA</p>
              </div>
              
              {/* Animated HUD scanning line */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent z-20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
