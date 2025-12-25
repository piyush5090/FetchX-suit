import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedItem, fetchRelatedMedia } from '../../features/media/mediaSlice';
import { LuX, LuDownload, LuUser, LuLoader, LuCopy, LuMaximize, LuRuler, LuActivity, LuInfo, LuLink } from 'react-icons/lu';
import MediaGrid from './MediaGrid';

export const SidebarContent = ({ brand, selectedItem }) => (
  <div className="p-6 space-y-8">
    {/* Creator & Download Section */}
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <span className={`inline-flex items-center self-start px-2 py-0.5 rounded-md ${brand.bg} ${brand.color} text-[9px] font-black uppercase tracking-[0.15em] shadow-sm`}>
          Verified {brand.label}
        </span>
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-md border border-slate-200 dark:border-slate-700">
            <LuUser size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-black text-slate-900 dark:text-white uppercase truncate tracking-tight leading-none">
              {selectedItem.photographer || 'Creator'}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Nexus Contributor
            </p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => window.open(selectedItem.url, '_blank')}
        className="group w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/15 active:scale-95"
      >
        <LuDownload size={14} className="group-hover:translate-y-0.5 transition-transform" /> 
        Download Asset
      </button>
    </div>

    {/* High-Contrast Technical Specs */}
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <LuInfo size={12} className="text-blue-500"/>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Technical Details</span>
      </div>
      
      <div className="grid gap-2">
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <LuRuler size={14}/> 
            <span className="text-[10px] font-black uppercase">Size</span>
          </div>
          <span className="text-[11px] font-mono font-black text-slate-900 dark:text-white leading-none">
            {selectedItem.width}x{selectedItem.height}
          </span>
        </div>
        
        <button 
          onClick={() => { navigator.clipboard.writeText(selectedItem.url); }}
          className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all rounded-xl border border-dashed border-slate-300 dark:border-slate-700 group"
        >
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600">
            <LuLink size={14}/> 
            <span className="text-[10px] font-black uppercase">CDN Node</span>
          </div>
          <LuCopy size={13} className="text-slate-300 group-hover:text-blue-600" />
        </button>
      </div>
    </div>

    {/* Classification Tags */}
    {selectedItem.tags && selectedItem.tags.length > 0 && (
      <div className="space-y-3">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">System Keywords</span>
        <div className="flex flex-wrap gap-1.5">
          {selectedItem.tags?.slice(0, 12).map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-md text-[9px] font-black uppercase border border-slate-200 dark:border-slate-800 shadow-sm">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const MediaModal = () => {
  const dispatch = useDispatch();
  const { selectedItem, relatedItems = [], relatedItemsStatus = 'idle' } = useSelector((state) => state.media);
  const observer = useRef();

  const lastItemRef = useCallback(node => {
    if (relatedItemsStatus === 'loading') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        dispatch(fetchRelatedMedia());
      }
    });
    if (node) observer.current.observe(node);
  }, [relatedItemsStatus, dispatch]);

  useEffect(() => {
    if (selectedItem && (!relatedItems || relatedItems.length === 0) && relatedItemsStatus !== 'loading') {
      dispatch(fetchRelatedMedia());
    }
  }, [selectedItem, relatedItems, relatedItems?.length, relatedItemsStatus, dispatch]);

  if (!selectedItem) return null;

  const handleClose = () => dispatch(clearSelectedItem());

  const brand = {
    unsplash: { color: 'text-white', bg: 'bg-black', label: 'UNSPLASH' },
    pexels: { color: 'text-white', bg: 'bg-emerald-600', label: 'PEXELS' },
    pixabay: { color: 'text-white', bg: 'bg-blue-600', label: 'PIXABAY' },
  }[selectedItem.source?.toLowerCase()] || { color: 'text-white', bg: 'bg-blue-600', label: selectedItem.source };

  return (
    <>
      {/* 1. Backdrop */}
      <div className="fixed inset-0 z-[60] bg-[#020617]/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={handleClose} />

      {/* 2. Modal Wrapper */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 md:p-4 pointer-events-none">
        <div 
          className="w-full max-w-6xl bg-white dark:bg-[#0b101b] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] pointer-events-auto max-h-[95vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* SYSTEM HEADER */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b101b] z-20">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded shadow-md shadow-blue-500/30">
                <LuActivity size={12} className="text-white animate-pulse"/>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-900 dark:text-slate-200">
                Nexus <span className="text-blue-600">Inspector</span>
              </span>
            </div>
            <button onClick={handleClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all">
              <LuX size={18} className="text-slate-400" />
            </button>
          </div>

          {/* MAIN SCROLLABLE AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#020617]">
            <div className="flex flex-col md:flex-row min-h-full">
              
              {/* LEFT: CONTENT AND MOBILE INFO */}
              <div className="flex-1 flex flex-col md:border-r border-slate-100 dark:border-slate-800">
                {/* CONTENT VIEWER */}
                <div className="p-4 md:p-8 flex items-center justify-center bg-slate-50 dark:bg-black min-h-[55vh] relative">
                  {selectedItem.type === 'image' ? (
                    <img src={selectedItem.url} alt="" className="max-w-full max-h-[70vh] object-contain shadow-2xl" />
                  ) : (
                    <video src={selectedItem.url} className="max-w-full max-h-[70vh] shadow-2xl" controls autoPlay muted />
                  )}
                </div>

                {/* INFO FOR MOBILE */}
                <div className="md:hidden bg-slate-50 dark:bg-[#0b101b] border-t border-slate-100 dark:border-slate-800">
                  <SidebarContent brand={brand} selectedItem={selectedItem} />
                </div>

                {/* RELATED ASSETS */}
                <div className="p-6 md:p-10 space-y-8">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Related Collections</h3>
                  </div>
                  
                  <MediaGrid 
                    items={relatedItems || []} 
                    status={relatedItemsStatus} 
                    lastItemRef={lastItemRef} 
                    error={null}
                  />

                  {relatedItemsStatus === 'loading' && (
                    <div className="flex justify-center py-10">
                      <LuLoader className="animate-spin text-blue-600" size={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: DESKTOP-ONLY SIDEBAR */}
              <aside className="hidden md:flex w-full md:w-72 bg-slate-50 dark:bg-[#0b101b] md:sticky md:top-0 md:h-[calc(95vh-45px)] flex-col flex-shrink-0 border-l border-slate-100 dark:border-slate-800">
                <div className="overflow-y-auto">
                  <SidebarContent brand={brand} selectedItem={selectedItem} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaModal;