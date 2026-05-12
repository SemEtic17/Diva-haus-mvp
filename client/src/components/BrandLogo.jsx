import React from 'react';
import chanelLogo from '../assets/brands/chanel.svg';
import lvLogo from '../assets/brands/louisVuitton.svg';

/**
 * BrandLogo Component
 * Renders high-quality official SVG logos for luxury fashion houses.
 * Includes a sophisticated circular edge glow animation.
 */
const BrandLogo = ({ brand, className = "h-8" }) => {
  // Map brand names (lowercase keys) to imported SVG assets
  const logos = {
    'chanel': chanelLogo,
    'louis vuitton': lvLogo,
    'lv': lvLogo,
  };

  const logoSrc = brand ? logos[brand.toLowerCase().trim()] : null;

  // Fallback if logo file isn't available
  if (!logoSrc) {
    return (
      <span className={`text-sm font-bold uppercase tracking-[0.3em] text-gold/80 flex items-center ${className}`}>
        {brand}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center group relative ${className}`}>
      {/* Edge Glow Animation Layer */}
      <img 
        src={logoSrc} 
        alt={`${brand} logo`} 
        className="h-full w-auto max-w-[120px] object-contain filter brightness-0 dark:invert opacity-90 transition-all duration-500 group-hover:opacity-100 logo-glow-animate"
      />
      
      {/* Subtle outer glow on hover */}
      <div className="absolute inset-0 -z-10 bg-gold/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default BrandLogo;
