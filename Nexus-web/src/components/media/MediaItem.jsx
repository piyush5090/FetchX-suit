import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { LuDownload, LuExpand, LuPlay, LuHeart } from 'react-icons/lu';
import { setSelectedItem } from '../../features/media/mediaSlice';

const MediaItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  // High-contrast source branding
  const sourceBrands = {
    unsplash: { bg: 'bg-black/80', text: 'text-white', label: 'Unsplash' },
    pexels: { bg: 'bg-emerald-600/90', text: 'text-white', label: 'Pexels' },
    pixabay: { bg: 'bg-blue-600/90', text: 'text-white', label: 'Pixabay' },
  };

  const config = sourceBrands[item.source.toLowerCase()] || { bg: 'bg-blue-600', text: 'text-white', label: item.source };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `Nexus-${item.source}-${item.id}`;
      a.click();
    } catch (error) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div
      className="relative group cursor-zoom-in overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => { setIsHovered(true); videoRef.current?.play(); }}
      onMouseLeave={() => { setIsHovered(false); videoRef.current?.pause(); if(videoRef.current) videoRef.current.currentTime = 0; }}
      onClick={() => dispatch(setSelectedItem(item))}
    >
      {/* 1. Content Rendering */}
      {item.type === 'image' ? (
        <img 
          src={item.previewURL} 
          alt="" 
          className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105" 
          loading="lazy"
        />
      ) : (
        <div className="relative aspect-video bg-slate-900">
          <video ref={videoRef} src={item.previewURL} className="w-full h-full object-cover" muted loop playsInline />
          {!isHovered && <LuPlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" size={30} />}
        </div>
      )}

      {/* 2. Top-Bar UI: Source & Favorite (High Visibility) */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
        <div className={`px-2 py-0.5 rounded-md backdrop-blur-md ${config.bg} ${config.text} text-[9px] font-black uppercase tracking-widest shadow-lg`}>
          {config.label}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
          className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-red-500 transition-all shadow-lg"
        >
          <LuHeart size={14} className={isFavorite ? 'fill-current text-red-500' : ''} />
        </button>
      </div>

      {/* 3. Bottom-Bar UI: Compact Info & Download */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter leading-none">
            {item.tags?.[0] || 'Premium Asset'}
          </p>
          <p className="text-[9px] text-white/60 font-medium truncate mt-1 italic">
            by {item.photographer || 'Creator'}
          </p>
        </div>

        <div className="flex gap-1.5">
          <button 
            onClick={handleDownload}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all active:scale-90 shadow-lg"
          >
            <LuDownload size={14} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/40 transition-all">
            <LuExpand size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaItem;