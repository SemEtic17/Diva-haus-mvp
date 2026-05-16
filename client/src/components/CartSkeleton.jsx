import React from 'react';
import { Skeleton } from './ui/Skeleton';

const CartSkeleton = () => {
  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 flex flex-col items-center">
          <Skeleton className="h-8 w-32 rounded-full mb-4" />
          <Skeleton className="h-12 w-64 mb-4" />
          <div className="mt-4 mx-auto w-24 h-px bg-gold/20" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-card/40 border border-glass-border/30 rounded-2xl">
                <Skeleton className="w-24 h-32 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="p-6 bg-card/60 border border-glass-border/30 rounded-3xl space-y-6">
              <Skeleton className="h-8 w-3/4 border-b border-border pb-4" />
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="pt-4 border-t border-border flex justify-between">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
