import React from 'react';
import { Skeleton } from './ui/Skeleton';

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Product Visuals Skeleton */}
          <div className="space-y-6">
            <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
            <Skeleton className="w-full h-[400px] rounded-3xl" />
          </div>

          {/* Product Details Skeleton */}
          <div className="flex flex-col space-y-8">
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>

              <div className="flex flex-col space-y-4">
                <Skeleton className="h-12 w-full max-w-md" />
                <Skeleton className="h-10 w-32" />
              </div>
            </header>

            {/* Color Variants Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-12 h-12 rounded-full" />
                ))}
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Info Grid Skeleton */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Skeleton className="flex-1 h-14 rounded-xl" />
              <Skeleton className="flex-1 h-14 rounded-xl" />
            </div>
            
            <div className="pt-8 space-y-2">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
