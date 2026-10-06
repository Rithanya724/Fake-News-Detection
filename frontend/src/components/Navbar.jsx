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
  Sparkles
} from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Analyze', path: '/detect', icon: ScanSearch },
    { name: 'History', path: '/history', icon: History },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: ShieldCheck }] : []),
    { name: 'About', path: '/about', icon: Info },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1C0B0A]/95 backdrop-blur-md border-b border-[#451F1B] h-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Brand Logo & Title with Reference Asterisk Icon */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-pill bg-[#2B120F] border border-[#5A2C26] flex items-center justify-center text-[#E57365] group-hover:border-[#E57365]/60 transition-colors shadow-subtle">
            <span className="text-base font-bold">✳</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-[#FAF8F5] transition-colors">
              texfacts<span className="text-[#E57365]">.</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-pill text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#843932] text-white border border-[#9E4238]/60 font-semibold shadow-subtle'
                    : 'text-[#C4AFA9] hover:text-white hover:bg-[#28110E]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* User / Auth Controls with reference Pill buttons */}
        <div className="hidden md:flex items-center space-x-2.5">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-pill bg-[#28110E] border border-[#451F1B] text-xs font-medium text-[#EDE3D8] hover:border-[#68312B] transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[#843932] text-white flex items-center justify-center font-bold text-[10px]">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[110px] truncate">{user?.name || 'Profile'}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-2 rounded-pill text-[#A8958B] hover:text-[#FB7185] hover:bg-[#28110E] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-pill text-xs font-medium text-[#EDE3D8] hover:text-white hover:bg-[#28110E] border border-transparent hover:border-[#451F1B] transition-all"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-pill bg-[#FAF8F5] hover:bg-white text-[#1C0B0A] text-xs font-semibold shadow-subtle transition-all border border-[#D8CCC0]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-pill text-[#C4AFA9] hover:text-white hover:bg-[#28110E]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#451F1B] bg-[#1C0B0A] px-4 py-3 space-y-1 shadow-luxury">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-pill text-xs font-medium ${
                  active ? 'bg-[#843932] text-white' : 'text-[#C4AFA9] hover:bg-[#28110E]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#451F1B] flex justify-between items-center text-xs">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#EDE3D8] font-medium"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[#FB7185] font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex space-x-2 w-full pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-pill bg-[#28110E] text-xs font-medium text-white border border-[#451F1B]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-pill bg-[#FAF8F5] text-xs font-semibold text-[#1C0B0A]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
