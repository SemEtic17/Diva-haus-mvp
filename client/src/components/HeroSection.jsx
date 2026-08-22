import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles as SparklesIcon } from 'lucide-react';
import Magnetic from './Magnetic';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-transparent pt-24 pb-12"
    >
      {/* Background Ambience (kept subtle so the global 3D scene reads) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,oklch(var(--gold-lch)/0.04)_0%,transparent_70%)]" />
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
          className="text-7xl md:text-8xl lg:text-[10rem] font-bold text-foreground leading-[0.8] tracking-tighter"
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
          <Magnetic>
            <motion.a
              href="#featured"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-gradient-to-r from-gold via-gold-light to-gold-dark text-background font-bold uppercase tracking-[0.2em] rounded-full shadow-neon-gold flex items-center gap-4 group"
            >
              {t('landing.explore_collection', 'Explore Collection')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </Magnetic>

          <Magnetic>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 glass-panel text-foreground font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all flex items-center gap-4"
            >
              {t('landing.how_it_works', 'How it Works')}
            </motion.a>
          </Magnetic>
        </motion.div>
      </div>

      {/* Right Content: transparent stage — the persistent global canvas draws
          the luxury mannequin scene here without the noisy HUD overlays */}
      <div className="relative z-10 w-full lg:w-1/2 h-[60vh] lg:h-screen flex items-center justify-center pointer-events-none" />
    </section>
  );
};

export default HeroSection;
