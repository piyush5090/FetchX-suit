import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { LuLayers, LuTerminal, LuUser, LuLogIn, LuMoon, LuSun } from 'react-icons/lu';

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="py-4">
      <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
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
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5">
            <a href="https://piyush5090.github.io/FetchX-docs" className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-[0.15em]">
              Docs
            </a>
          </div>

          <div className="hidden md:block h-3 w-px bg-slate-200 dark:bg-slate-800" />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-all group">
                <LuUser size={12} className="group-hover:text-blue-600 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-tight">Profile</span>
              </Link>
              <button onClick={handleLogout} className="text-sm font-bold text-slate-500 hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-bold text-black bg-blue-100 rounded-md hover:bg-blue-300">
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;