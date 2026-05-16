import React from 'react';
import { Skeleton } from './ui/Skeleton';

const ProductSkeleton = () => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl 
                 bg-card/40 backdrop-blur-xl
                 border border-glass-border/30
                 shadow-luxury
                 w-full">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-secondary/10 p-6 flex items-center justify-center">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>

      {/* Content Container */}
      <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-6">
        <div className="text-center space-y-4">
          {/* Product Name Skeleton */}
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>

          {/* Decorative divider skeleton */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gold/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold/20" />
            <div className="h-px w-8 bg-gold/20" />
          </div>

          {/* Price Skeleton */}
          <Skeleton className="h-8 w-24 mx-auto" />
        </div>

        {/* Add to Cart Button Skeleton */}
        <div className="mt-2">
          <Skeleton className="w-full h-[52px] rounded-xl" />
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gold/20" />
    </div>
  );
};

export default ProductSkeleton;
