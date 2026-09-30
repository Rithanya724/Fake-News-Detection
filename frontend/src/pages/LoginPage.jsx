import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Mail, Lock, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-emerald-400 mx-auto">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Sign in to TEX-FACTS</h2>
          <p className="text-xs text-slate-400">Enter your credentials to access the analytics console</p>
        </div>

        {/* Subtle Demo Access Box */}
        <div className="p-3.5 rounded-card bg-[#111827] border border-[#263244] space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Demo access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user@textile.org', 'User@123')}
              className="p-2 rounded-input bg-[#172033] hover:bg-[#202b42] border border-[#263244] text-left text-xs transition-colors cursor-pointer"
            >
              <span className="font-semibold text-emerald-400 block">Analyst</span>
              <span className="text-[10px] text-slate-400">user@textile.org</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@textile.org', 'Admin@123')}
              className="p-2 rounded-input bg-[#172033] hover:bg-[#202b42] border border-[#263244] text-left text-xs transition-colors cursor-pointer"
            >
              <span className="font-semibold text-indigo-400 block">Admin</span>
              <span className="text-[10px] text-slate-400">admin@textile.org</span>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="ui-card p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-input bg-rose-950/40 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@textile.org"
                className="ui-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ui-input text-xs"
              />
            </div>

            <Button
              type="submit"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-[#263244]">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline font-medium">
              Register here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
