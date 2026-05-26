import React from "react";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 dark:bg-white/10 ${className || ""}`}
      {...props}
    />
  );
};

export { Skeleton };
