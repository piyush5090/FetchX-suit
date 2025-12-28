import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';
import { LuLayers, LuShieldPlus, LuLock, LuMail, LuActivity } from 'react-icons/lu';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Logic remains untouched per request */
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, { email, password });
      dispatch(loginSuccess({ ...response.data, email }));
      navigate('/profile');
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFDFD] dark:bg-[#020617] p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
        
        {/* --- Brand Header --- */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 transform -rotate-6 mb-2">
            <LuLayers className="text-white" size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Nexus<span className="text-blue-600 font-light not-italic ml-1 text-lg">by FetchX</span>
          </h2>
          <div className="flex items-center justify-center gap-2 opacity-50">
            <LuShieldPlus size={12} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-slate-400">Initialize New Node</span>
          </div>
        </div>

        {/* --- Registration Card --- */}
        <div className="bg-white dark:bg-[#0b101b] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Node</label>
              <div className="relative group">
                <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Creation Secret</label>
              <div className="relative group">
                <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none dark:text-white"
                  required
                />
              </div>
            </div>

          <div className='flex justify-center' >
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <LuActivity className="animate-spin" size={16} />
              ) : (
                'Register'
              )}
            </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-tight text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* --- Footer Links --- */}
        <p className="mt-8 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Already part of the Nexus?</span>
          <Link to="/login" className="ml-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            Login Node
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;