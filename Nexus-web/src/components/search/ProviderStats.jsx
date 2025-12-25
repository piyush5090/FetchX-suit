import React from 'react';
import { useSelector } from 'react-redux';
import { LuLoader, LuActivity } from 'react-icons/lu';

const ProviderStats = () => {
  const { providerCounts, countsStatus } = useSelector((state) => state.media);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (countsStatus === 'loading') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <LuLoader className="animate-spin text-blue-600" size={14} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Syncing Nexus...</span>
      </div>
    );
  }

  if (!providerCounts) return null;

  // Re-introducing full names with high-contrast color pairs
  const providers = [
    { 
      key: 'pexels', 
      name: 'Pexels', 
      color: 'text-emerald-700 dark:text-emerald-400', 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-200 dark:border-emerald-500/20'
    },
    { 
      key: 'unsplash', 
      name: 'Unsplash', 
      color: 'text-slate-700 dark:text-slate-300', 
      bg: 'bg-slate-100 dark:bg-slate-500/10',
      border: 'border-slate-300 dark:border-slate-500/20'
    },
    { 
      key: 'pixabay', 
      name: 'Pixabay', 
      color: 'text-blue-700 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      border: 'border-blue-200 dark:border-blue-500/20'
    }
  ];

  const availableProviders = providers.filter(p => providerCounts[p.key]?.available > 0);
  if (availableProviders.length === 0) return null;

  return (
    <div className="flex items-center gap-2.5">
      {/* Visual Activity Indicator */}
      <div className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <LuActivity size={14} className="text-blue-600 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Live Inventory</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {availableProviders.map(p => {
          const count = providerCounts[p.key]?.available || 0;
          return (
            <div 
              key={p.key} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${p.bg} ${p.border} shadow-sm transition-transform hover:scale-105`}
            >
              <span className={`text-[11px] font-black uppercase tracking-tight ${p.color}`}>
                {p.name}
              </span>
              <div className={`w-[1px] h-3 opacity-30 ${p.color.replace('text', 'bg')}`} />
              <span className={`text-[11px] font-mono font-black ${p.color} leading-none`}>
                {formatNumber(count)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderStats;