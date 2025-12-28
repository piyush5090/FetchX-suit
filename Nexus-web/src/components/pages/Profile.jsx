import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../features/auth/authSlice';
import { LuLayers, LuCopy, LuCheck, LuZap, LuShieldCheck, LuActivity, LuUser, LuCalendar } from 'react-icons/lu';

const StatCard = ({ label, value, icon: Icon, className = '' }) => (
  <div className={`bg-white dark:bg-[#0b101b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-blue-500/30 ${className}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
        <Icon size={14} className="text-blue-600" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{label}</p>
    </div>
    <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{value}</p>
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, error } = useSelector((state) => state.auth);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchUserProfile());
  }, [dispatch, isAuthenticated]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 dark:bg-[#020617]">
        <LuActivity className="animate-spin text-blue-600" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Nexus Node...</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#020617]">
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 text-xs font-black uppercase tracking-widest">
          Node Sync Failure: {error}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const monthlyQuota = Number(user?.monthly_quota ?? 0);
  const usageCount = Number(user?.usage_count ?? 0);
  const isUnlimited = monthlyQuota === -1;
  const requestsRemaining = isUnlimited ? "∞" : (monthlyQuota - usageCount);
  const usagePercentage = isUnlimited ? 100 : monthlyQuota > 0 ? (usageCount / monthlyQuota) * 100 : 0;
  const quotaResetDate = user?.usage_cycle_end ? new Date(user.usage_cycle_end).toLocaleDateString() : "Next Cycle";

  const handleCopy = () => {
    if (user?.api_key) {
      navigator.clipboard.writeText(user.api_key);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#020617] pt-14 pb-20 selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* --- BRAND HEADER --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="p-4 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/30 transform -rotate-6">
              <LuLayers className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                Nexus<span className="text-blue-600 font-light not-italic ml-2">Developer Hub</span>
              </h1>
              <div className="flex items-center gap-2 mt-1 opacity-60">
                <LuUser size={12} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-widest dark:text-slate-300">Active Node: <span className='text-green-50 italic lowercase' >{user.email}</span></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Systems Operational</span>
          </div>
        </div>

        {/* --- API CREDENTIALS --- */}
        <div className="bg-white dark:bg-[#0b101b] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl shadow-slate-200/50 dark:shadow-none animate-in fade-in duration-1000">
          <div className="flex items-center gap-3 mb-6">
            <LuShieldCheck className="text-blue-600" size={20} />
            <h2 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Security Protocol / API Key</h2>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <code className="flex-1 font-mono text-sm text-blue-600 dark:text-blue-400 font-bold truncate">
                {user.api_key}
              </code>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isCopied ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-blue-600 text-white hover:opacity-90'
                }`}
              >
                {isCopied ? <LuCheck size={14} /> : <LuCopy size={14} />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Note: This key grants administrative access to the FetchX Protocol. Protect it at all costs.
          </p>
        </div>

        {/* --- USAGE METRICS --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <LuActivity className="text-blue-600" size={18} />
            <h2 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Operational Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={LuLayers} label="Monthly Allocation" value={isUnlimited ? "∞" : monthlyQuota.toLocaleString()} />
            <StatCard icon={LuZap} label="Requests Processed" value={usageCount.toLocaleString()} />
            <StatCard icon={LuShieldCheck} label="Available Cycles" value={isUnlimited ? "∞" : Math.max(requestsRemaining, 0).toLocaleString()} />
          </div>

          {/* --- PROGRESS BAR --- */}
          <div className="bg-white dark:bg-[#0b101b] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quota Saturation</p>
                <p className="text-3xl font-black dark:text-white font-mono">{usagePercentage.toFixed(1)}%</p>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <LuCalendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Cycle Reset: {quotaResetDate}</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 p-1 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full shadow-lg shadow-blue-500/40 transition-all duration-1000 ease-out"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;