import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`bg-[#28110E] animate-pulse rounded-md ${className}`} />
);

export const CardSkeleton = () => (
  <div className="ui-card p-5 space-y-3">
    <div className="flex justify-between items-center">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-7 w-20" />
    <Skeleton className="h-3 w-32" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3 p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 py-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);
