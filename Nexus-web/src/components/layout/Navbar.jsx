import React, { useState, useEffect } from 'react';
import { LuLayers, LuDownload, LuGithub, LuMoon, LuSun, LuTerminal } from 'react-icons/lu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-200 ${
      isScrolled 
        ? 'py-2 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' 
        : 'py-4 bg-transparent'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
        
        {/* 1. Brand Identity: Nexus by FetchX */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="p-1.5 bg-blue-600 rounded-lg shadow-sm transform group-hover:rotate-6 transition-transform">
            <LuLayers className="text-white" size={14} />
          </div>
          <div className="flex items-baseline">
            <h2 className="text-[16px] font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
              Nexus
            </h2>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight ml-1.5 opacity-80">
              by FetchX
            </span>
          </div>
        </div>

        {/* 2. Scaled Down Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-5 items-center">
            <a href="/docs" className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-[0.15em]">
              Docs
            </a>
          </div>

          <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Extension Beta Link */}
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-all group">
            <LuTerminal size={12} className="group-hover:text-blue-600 transition-colors" /> 
            <span className="text-[10px] font-black uppercase tracking-tight">Extension Beta</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;