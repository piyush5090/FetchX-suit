import React from 'react';
/* Corrected icon to LuPlay for standard Lucide set */
import { LuLayers, LuGithub, LuTwitter, LuGlobe, LuExternalLink, LuArrowRight, LuDownload, LuPlay, LuBookOpen } from 'react-icons/lu';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sources = [
    { name: 'Pexels', url: 'https://www.pexels.com/api/', icon: '📸' },
    { name: 'Unsplash', url: 'https://unsplash.com/developers', icon: '🎨' },
    { name: 'Pixabay', url: 'https://pixabay.com/api/docs/', icon: '🖼️' },
  ];

  return (
    <footer className="bg-white dark:bg-[#020617] border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
      <div className="container mx-auto px-6 py-20">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 mb-16">
          
          {/* Brand Column - Updated Branding */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 transform -rotate-3">
                <LuLayers className="text-white" size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
                  Nexus<span className="text-blue-600 font-light not-italic ml-2 text-base">by FetchX</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Unified Discovery Hub</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs font-medium">
              The premier aggregation terminal connecting global stock libraries into one synchronized interface.
            </p>
            <div className="flex gap-4 pt-2">
              {[LuGithub, LuTwitter, LuGlobe].map((Icon, idx) => (
                <a key={idx} href="#" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Integrated Sources */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white border-l-2 border-blue-600 pl-3">Sources</h4>
            <ul className="space-y-4">
              {sources.map((source) => (
                <li key={source.name}>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 flex items-center gap-3 transition-all font-bold"
                  >
                    <span className="filter grayscale group-hover:grayscale-0 transition-all">{source.icon}</span>
                    {source.name}
                    <LuExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Links - Demo Video & Manual Docs */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white border-l-2 border-blue-600 pl-3">Ecosystem</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => alert("Launching Video Demo...")} 
                  className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all group text-left"
                >
                  <LuPlay size={16} className="group-hover:scale-110 transition-transform fill-blue-600/10" /> Watch Extension Demo
                </button>
              </li>
              <li>
                <a href="/docs" className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all group">
                  <LuBookOpen size={16} className="group-hover:scale-110 transition-transform" /> Documentation
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-700 select-none">
                  <LuDownload size={14} /> Extension Coming Soon
                </div>
              </li>
            </ul>
          </div>

          {/* Platform Status */}
          <div className="md:col-span-2 space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Nexus Intelligence</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Protocol Active</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">99.9% Uptime</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="w-full h-full bg-blue-600 rounded-full" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic">
                FetchX Sync Latency: <span className="text-blue-600 font-bold">~140ms</span>
              </p>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                View System Metrics <LuArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            &copy; {currentYear} <span className="text-slate-900 dark:text-white">Nexus by FetchX</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.3em]">
              Synchronized Media Terminal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;