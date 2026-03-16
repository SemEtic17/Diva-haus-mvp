import React from 'react';
import ThreeScene from '../three/ThreeScene';
import HoloPedestal from '../three/HoloPedestal';
import MannequinModel from '../three/MannequinModel';
import GlassCube from '../three/GlassCube';
import WireframeGrid from '../three/WireframeGrid';
import { useTranslation } from 'react-i18next';

const HolographicContainer = ({ children, product, comingSoon = true }) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-xl">
      {comingSoon && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white p-4"
             style={{ pointerEvents: 'none' }}> 
          <h2 className="text-4xl font-bold mb-2">{t('products.coming_soon')}</h2>
          <p className="text-xl mb-4">{t('products.three_d_preview')}</p>
          <p className="text-center max-w-md">
            {t('products.three_d_preview_desc')}
          </p>
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