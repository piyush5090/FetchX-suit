import React from 'react';
import MediaItem from './MediaItem';
import MediaSkeleton from './MediaSkeleton';
import { LuImageOff, LuSearch, LuLoader } from 'react-icons/lu';

const MediaGrid = ({ items = [], status, error, lastItemRef }) => {
  
  // 1. Loading State - Compact Skeletons
  if (status === 'loading' && items.length === 0) {
    return (
      <div className="space-y-4">
        <MediaSkeleton count={15} />
        <div className="flex items-center justify-center gap-2 pt-4 opacity-60">
          <LuLoader className="animate-spin text-blue-600" size={14} />
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Syncing Nexus...</p>
        </div>
      </div>
    );
  }

  // 2. Error State - Tight Layout
  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-red-200 dark:border-red-900/30">
        <LuImageOff className="text-red-500 mb-2 opacity-50" size={20} />
        <h3 className="text-[11px] font-black uppercase tracking-tighter text-slate-900 dark:text-white">Nexus Error</h3>
        <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] text-center leading-tight">
          {error || 'Connection failed. Verify API protocols.'}
        </p>
      </div>
    );
  }

  // 3. Empty State - Minimalist
  if ((status === 'succeeded' || status === 'idle') && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        <LuSearch className="text-slate-400 mb-2" size={20} />
        <h3 className="text-[11px] font-black uppercase tracking-tighter text-slate-900 dark:text-white">Null Result</h3>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest text-center">No assets found in terminal</p>
      </div>
    );
  }

  // 4. Precision Masonry Layout
  return (
    /* Reduced gap-3/gap-4 to gap-2 for that tight, professional gallery look */
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2.5 space-y-2.5">
      {items && items.length > 0 && items.map((item, index) => {
        const isLastItem = items.length === index + 1;
        return (
          <div 
            ref={isLastItem ? lastItemRef : null} 
            key={`${item.id}-${item.source}`} 
            className="animate-in fade-in duration-300 ease-out break-inside-avoid"
          >
            <MediaItem item={item} />
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;