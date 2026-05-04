import React from 'react';
import chanelLogo from '../assets/brands/chanel.svg';

/**
 * BrandLogo Component
 * Renders high-quality official SVG logos for luxury fashion houses.
 */
const BrandLogo = ({ brand, className = "" }) => {
  // Map brand names to imported SVG assets
  const logos = {
    'Chanel': chanelLogo,
    // Add more brands here as you download their SVGs:
    // 'Gucci': gucciLogo,
  };

  const logoSrc = logos[brand];

  // Fallback if logo file isn't available
  if (!logoSrc) {
    return (
      <span className={`text-sm font-bold uppercase tracking-[0.3em] text-gold/80 ${className}`}>
        {brand}
      </span>
    );
  }

  return (
    <div className={`h-full flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt={`${brand} logo`} 
        className="h-full w-auto object-contain filter brightness-0 dark:invert opacity-80 transition-opacity hover:opacity-100"
      />
    </div>
  );
};

export default BrandLogo;
