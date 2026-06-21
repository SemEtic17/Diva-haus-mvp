import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles as SparklesIcon } from 'lucide-react';
import ThreeScene from '../three/ThreeScene';
import LandingHeroThree from '../three/LandingHeroThree';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-background pt-24 pb-12">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,oklch(var(--gold-lch)/0.03)_0%,transparent_70%)]" />
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[140px]" />
      </div>

      {/* Left Content: Text & CTA */}
      <div className="relative z-10 w-full lg:w-1/2 px-6 sm:px-12 lg:px-20 flex flex-col items-start text-left space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-panel border-gold/20 shadow-luxury"
        >
          <SparklesIcon className="w-4 h-4 text-gold animate-pulse" />
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">
            {t('landing.hero_badge', 'The Future of Fashion')}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-8xl lg:text-[11rem] font-bold text-foreground leading-[0.8] tracking-tighter"
        >
          <span className="block">DIVA</span>
          <span className="block text-gold drop-shadow-[0_0_15px_oklch(var(--gold-lch)/0.3)]">HAUS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-md text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-medium"
        >
          {t('landing.hero_desc', 'Step into the digital atelier. Experience luxury couture through the lens of AI Virtual Try-On.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-wrap gap-6 pt-6"
        >
          <motion.a
            href="#collection"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 bg-gradient-to-r from-gold via-gold-light to-gold-dark text-background font-bold uppercase tracking-[0.2em] rounded-full shadow-neon-gold flex items-center gap-4 group"
          >
            {t('landing.explore_collection', 'Explore Collection')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 glass-panel text-foreground font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all flex items-center gap-4"
          >
            {t('landing.how_it_works', 'How it Works')}
          </motion.button>
        </motion.div>
      </div>

      {/* Right Content: 3D Artifact Container */}
      <div className="relative z-10 w-full lg:w-1/2 h-[70vh] lg:h-screen flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full max-w-2xl glass-panel rounded-[5rem] border-white/10 shadow-luxury-hover overflow-hidden group"
        >
          <ThreeScene orbit={false}>
            <LandingHeroThree />
          </ThreeScene>
          
          {/* Holographic Interface Overlays */}
          <div className="absolute inset-0 pointer-events-none p-12">
            <div className="flex justify-between items-start w-full">
              <div className="space-y-4">
                <div className="w-12 h-px bg-gold/50" />
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-gold uppercase tracking-[0.5em]">Neural Mesh</p>
                  <p className="text-[9px] text-neon-cyan font-mono opacity-80 animate-pulse">STATUS: OPTIMIZED</p>
                </div>
              </div>
              
              <div className="text-right space-y-4">
                <div className="w-12 h-px bg-gold/50 ml-auto" />
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-gold uppercase tracking-[0.5em]">Render Engine</p>
                  <p className="text-[9px] text-neon-pink font-mono opacity-80">v2.0.4-DIVA</p>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
              <div className="space-y-2">
                <p className="text-[8px] text-white/30 font-mono tracking-widest uppercase">Location: GLOBAL_ATELIER_01</p>
                <div className="flex gap-2">
                  <div className="w-1 h-1 bg-neon-cyan rounded-full animate-ping" />
                  <div className="w-1 h-1 bg-neon-pink rounded-full animate-ping [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-gold rounded-full animate-ping [animation-delay:0.4s]" />
                </div>
              </div>
              
              <div className="font-mono text-[8px] text-white/20 text-right">
                <p>34.0522° N, 118.2437° W</p>
                <p>TIMESTAMP: {new Date().getFullYear()}.06.20</p>
              </div>
            </div>
            
            {/* Scanned Area Frame */}
            <div className="absolute inset-16 border border-white/5 rounded-[3rem] pointer-events-none" />
            
            {/* Animated HUD scanning line (CSS fallback for 3D scan) */}
            <motion.div 
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute left-16 right-16 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-20"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
