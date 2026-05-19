import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const MaintenanceMode = ({ settings }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gold/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neon-cyan/10 rounded-full blur-[100px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl w-full space-y-8 backdrop-blur-sm bg-white/5 border border-white/10 p-12 rounded-[40px] shadow-2xl"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-gold/10 rounded-3xl border border-gold/20">
            <Hammer className="w-12 h-12 text-gold animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter">
            <span className="text-gradient-gold uppercase">Coming Back</span>
            <br />
            <span className="text-white uppercase">Soon</span>
          </h1>
          <p className="text-muted-foreground text-lg italic max-w-md mx-auto">
            {settings.siteName} is currently undergoing a private transformation. We are refining our luxury experience for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <Mail className="w-6 h-6 text-gold mb-3 mx-auto" />
            <p className="text-xs uppercase tracking-widest text-gold/60 mb-1">Support</p>
            <p className="text-sm text-white font-medium">{settings.supportEmail || 'support@divahaus.com'}</p>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <Lock className="w-6 h-6 text-gold mb-3 mx-auto" />
            <p className="text-xs uppercase tracking-widest text-gold/60 mb-1">Status</p>
            <p className="text-sm text-white font-medium">Under Maintenance</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em]">Are you an administrator?</p>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gold border border-gold/30 px-6 py-2 rounded-full text-xs font-semibold hover:bg-gold hover:text-black transition-all duration-300 flex items-center gap-2"
            >
              <Lock className="w-3 h-3" />
              STAFF LOGIN
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenanceMode;
