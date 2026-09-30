import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ScanSearch, 
  History, 
  BarChart3, 
  Info, 
  User, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze', path: '/detect', icon: ScanSearch },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
    { name: 'About', path: '/about', icon: Info },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-b border-[#263244] h-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Brand Title */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            TEX-FACTS
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#172033]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* User / Auth Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-[#172033] border border-[#263244] text-xs font-medium text-slate-200 hover:border-slate-600 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user?.name || 'Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-[#172033] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-[#172033] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-subtle transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-[#172033]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#263244] bg-[#0B1120] px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-xs font-medium ${
                  active ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30' : 'text-slate-300 hover:bg-[#172033]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#263244] flex justify-between items-center text-xs">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 font-medium"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-rose-400 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex space-x-2 w-full pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-md bg-[#172033] text-xs font-medium text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-md bg-emerald-600 text-xs font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
