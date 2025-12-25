import React from 'react';

const MediaSkeleton = ({ count = 15 }) => {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="bg-gradient-to-br from-slate-200 via-slate-150 to-slate-100 animate-pulse rounded-xl w-full break-inside-avoid shadow-sm overflow-hidden"
          style={{ height: Math.random() * 200 + 180 }}
        >
          {/* Shimmer effect */}
          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MediaSkeleton;
