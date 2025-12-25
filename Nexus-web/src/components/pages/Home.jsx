import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, setPage, fetchSearchCounts, setSearchTerms } from '../../features/media/mediaSlice';
import SearchBar from '../search/SearchBar';
import MediaGrid from '../media/MediaGrid';
import ProviderStats from '../search/ProviderStats';
import { LuChevronLeft, LuChevronRight, LuLoader, LuLayers, LuZap, LuImage, LuVideo, LuArrowRight, LuActivity, LuGlobe, LuShieldCheck, LuTerminal } from 'react-icons/lu';

const Home = () => {
  const dispatch = useDispatch();
  const { query, mediaType, page, items, status, error } = useSelector((state) => state.media);

  useEffect(() => {
    if(query) dispatch(fetchMedia());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, query, mediaType, page]);

  useEffect(() => {
    if(query) dispatch(fetchSearchCounts());
  }, [dispatch, query, mediaType]);

  const handleNextPage = () => dispatch(setPage(page + 1));
  const handlePrevPage = () => page > 1 && dispatch(setPage(page - 1));
  const isLanding = useMemo(() => !query && page === 1, [query, page]);
  
  const handleMediaTypeChange = (newType) => {
    if (mediaType !== newType) {
      dispatch(setSearchTerms({ query, mediaType: newType }));
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#FDFDFD] dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden">
      
      {/* 1. Immersive Hero Section */}
      <header className={`relative w-full transition-all duration-700 ease-in-out z-40 ${isLanding ? 'min-h-[85vh] flex items-center justify-center' : 'pt-24 pb-6 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0'}`}>
        {isLanding && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 animate-pulse" />
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 dark:opacity-40" alt="" />
          </div>
        )}

        <div className="w-full px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className={`flex flex-col gap-12 ${isLanding ? 'items-center text-center' : 'md:flex-row md:items-center'}`}>
              
              {/* Brand Branding - Updated for "Nexus by FetchX" */}
              <div className={`${isLanding ? 'space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-1000' : 'hidden md:block'}`}>
                <div className={`flex items-center gap-4 ${isLanding ? 'justify-center' : ''}`}>
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-500/40 transform -rotate-6">
                    <LuLayers className="text-white" size={isLanding ? 36 : 20} />
                  </div>
                  <div className="flex flex-col items-start">
                     {isLanding && <span className="text-[12px] font-black text-blue-600 tracking-[0.4em] uppercase mb-1">Unifying Discovery</span>}
                     <h1 className={`${isLanding ? 'text-5xl md:text-8xl' : 'text-xl'} font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none`}>
                        Nexus<span className="text-blue-600 font-light not-italic ml-2">by FetchX</span>
                     </h1>
                  </div>
                </div>
                {isLanding && (
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
                    The elite terminal for professional asset aggregation. <br/>
                    <span className="text-blue-600 font-bold underline decoration-blue-500/30">Pexels + Unsplash + Pixabay</span>, synchronized via FetchX.
                  </p>
                )}
              </div>

              {/* Search Core */}
              <div className={`grow transition-all duration-700 ${isLanding ? 'w-full max-w-3xl scale-110' : ''}`}>
                <SearchBar />
                {isLanding && (
                   <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-60">
                     {[
                       { icon: <LuGlobe size={14}/>, text: "Nexus Index" },
                       { icon: <LuShieldCheck size={14}/>, text: "FetchX Verified" },
                       { icon: <LuTerminal size={14}/>, text: "API Protocol" }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                         {item.icon} {item.text}
                       </div>
                     ))}
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Content Engine */}
      <main className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Media Feed */}
          <div className="flex-1 min-w-0">
            {query && (
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-100 dark:border-slate-800 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-12 bg-blue-600 rounded-full" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Syncing Collection</span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white capitalize tracking-tighter leading-none">{query}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  {['images', 'videos'].map(type => (
                    <button key={type} onClick={() => handleMediaTypeChange(type)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mediaType === type ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <MediaGrid key={`${query}-${mediaType}`} items={items} status={status} error={error} />
          </div>

          {/* Right Column: Information Density Sidebar */}
          {query && (
            <aside className="w-full lg:w-80 space-y-8">
              {/* Nexus System Overview Card */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 sticky top-48 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Nexus Intelligence</h3>
                   <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-bold text-emerald-500 uppercase">Live Index</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <ProviderStats />
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Discovery Metrics</p>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <p className="text-xl font-black text-slate-900 dark:text-white">{items.length}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Nodes Found</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <p className="text-xl font-black text-blue-600">124ms</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">API Latency</p>
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                      <LuZap size={16} className="text-blue-600" />
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-tight">
                        FetchX protocol is optimizing results based on high-resolution availability.
                      </p>
                   </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* 3. Global Pagination Terminal */}
        {items.length > 0 && (
          <div className="mt-32 flex flex-col items-center gap-10">
            <div className="flex items-center gap-3 px-6 py-2 bg-slate-50 dark:bg-slate-900 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border border-slate-100 dark:border-slate-800">
               <LuActivity className="text-blue-600" size={14} /> Synchronized via FetchX Protocol
            </div>
            
            <nav className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl p-1.5">
              <button onClick={handlePrevPage} disabled={page === 1 || status === 'loading'} className="p-5 rounded-full transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-20 group">
                <LuChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
              </button>
              <div className="px-12 flex flex-col items-center border-x border-slate-100 dark:border-slate-800">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Nexus Index</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {status === 'loading' ? <LuLoader className="animate-spin text-blue-600" /> : `0${page}`}
                </span>
              </div>
              <button onClick={handleNextPage} disabled={items.length === 0 || status === 'loading'} className="p-5 rounded-full transition-all hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-20 group">
                <LuChevronRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;