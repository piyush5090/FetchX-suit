import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerms } from '../../features/media/mediaSlice';
import { LuSearch, LuImage, LuVideo, LuX, LuCommand } from 'react-icons/lu';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { query: currentQuery, mediaType: currentMediaType } = useSelector((state) => state.media);
  
  const [localQuery, setLocalQuery] = useState(currentQuery || '');
  const [localMediaType, setLocalMediaType] = useState(currentMediaType || 'images');

  useEffect(() => { setLocalQuery(currentQuery || ''); }, [currentQuery]);
  useEffect(() => { setLocalMediaType(currentMediaType || 'images'); }, [currentMediaType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = localQuery.trim();
    if (!trimmedQuery || (trimmedQuery === currentQuery && localMediaType === currentMediaType)) return;
    dispatch(setSearchTerms({ query: trimmedQuery, mediaType: localMediaType }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="group">
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-200">
          
          {/* 1. Compact Type Toggle */}
          <div className="flex items-center px-1 py-1 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800">
            <select
              value={localMediaType}
              onChange={(e) => setLocalMediaType(e.target.value)}
              className="appearance-none bg-transparent pl-2 pr-1 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 outline-none cursor-pointer hover:text-blue-600 transition-colors"
            >
              <option value="images">IMG</option>
              <option value="videos">VID</option>
            </select>
            <div className="pr-1 opacity-40">
               {localMediaType === 'images' ? <LuImage size={10} /> : <LuVideo size={10} />}
            </div>
          </div>

          {/* 2. Micro Search Input */}
          <div className="relative flex-grow flex items-center">
            <LuSearch className="absolute left-3 text-slate-400" size={14} />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setLocalQuery('')}
              placeholder="Search Nexus terminal..."
              className="w-full pl-9 pr-8 py-2 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-[12px] font-medium outline-none"
            />
            
            {localQuery && (
              <button
                type="button"
                onClick={() => setLocalQuery('')}
                className="absolute right-2 p-1 text-slate-300 hover:text-red-500 transition-colors"
              >
                <LuX size={12} />
              </button>
            )}
          </div>

          {/* 3. Integrated Action Button */}
          <div className="px-1">
            <button
              type="submit"
              disabled={!localQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Execute
            </button>
          </div>
        </div>
      </form>

      {/* 4. Minimalist Hint */}
      <div className="flex items-center gap-4 mt-2 px-1">
        <div className="flex items-center gap-1.5 opacity-40">
           <LuCommand size={10} className="text-slate-500" />
           <p className="text-[9px] font-bold uppercase tracking-tighter text-white">
             Esc to Clear Terminal
           </p>
        </div>
        <div className="h-2 w-px bg-slate-200 dark:bg-slate-800" />
        <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">
          Status: <span className="text-emerald-500">Ready</span>
        </p>
      </div>
    </div>
  );
};

export default SearchBar;