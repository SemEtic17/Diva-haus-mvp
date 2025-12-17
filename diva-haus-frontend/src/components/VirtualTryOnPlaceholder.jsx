import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Upload, Zap } from 'lucide-react';

const VirtualTryOnPlaceholder = () => {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-4xl mx-auto relative"
      >
        {/* Glassmorphism panel with neon border */}
        <div className="relative rounded-3xl overflow-hidden bg-black/50">
          {/* Neon border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 p-[1px]" style={{ zIndex: 1 }}>
            <div className="w-full h-full rounded-3xl bg-black" />
          </div>

          {/* Content container */}
          <div className="relative backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16" style={{ zIndex: 2 }}>
            {/* Icon badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Camera className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
                </div>
                {/* Floating sparkle */}
                <motion.div
                  animate={{ 
                    y: [-2, 2, -2],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: 'easeInOut' 
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Coming Soon
              </span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                AI Virtual{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                  Try-On
                </span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Experience the future of fashion. Upload your photo and see how our exclusive pieces look on you.
              </p>
            </motion.div>

            {/* Features list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10"
            >
              {['AI-Powered Fitting', 'Instant Preview', 'Size Recommendations'].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm md:text-base text-gray-300/80"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  {feature}
                </div>
              ))}
            </motion.div>

            {/* CTA Button linking to profile page */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex justify-center"
            >
              <Link to="/profile">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold px-8 py-4 text-base rounded-xl shadow-[0_10px_30px_-5px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_-5px_rgba(234,179,8,0.4)] transition-all duration-300 group flex items-center"
                >
                  <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Upload Your Photo
                </motion.div>
              </Link>
            </motion.div>

            {/* Privacy note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center text-gray-500 text-sm mt-6"
            >
              Your photos are processed securely and never stored.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VirtualTryOnPlaceholder;
