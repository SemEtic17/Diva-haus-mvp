import React from 'react';
import chanelLogo from '../assets/brands/chanel.svg';
import lvLogo from '../assets/brands/louisVuitton.svg';

/**
 * BrandLogo Component
 * Renders high-quality official SVG logos for luxury fashion houses.
 */
const BrandLogo = ({ brand, className = "" }) => {
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
