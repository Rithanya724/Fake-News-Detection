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
          <div className="w-10 h-10 rounded-pill bg-[#28110E] border border-[#5A2C26] flex items-center justify-center text-[#E57365] mx-auto shadow-subtle">
            <span className="text-xl font-bold">✳</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign in to texfacts.</h2>
          <p className="text-xs text-[#A8958B]">Enter your credentials to access the intelligence console</p>
        </div>

        {/* Demo Access Box */}
        <div className="p-4 rounded-2xl bg-[#240E0C] border border-[#451F1B] space-y-2.5">
          <span className="text-[10px] font-bold text-[#A8958B] uppercase tracking-wider block">
            1-Click Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user@textile.org', 'User@123')}
              className="p-2.5 rounded-xl bg-[#180908] hover:bg-[#341613] border border-[#451F1B] text-left text-xs transition-colors cursor-pointer"
            >
              <span className="font-bold text-[#34D399] block">Analyst</span>
              <span className="text-[10px] text-[#A8958B]">user@textile.org</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@textile.org', 'Admin@123')}
              className="p-2.5 rounded-xl bg-[#180908] hover:bg-[#341613] border border-[#451F1B] text-left text-xs transition-colors cursor-pointer"
            >
              <span className="font-bold text-[#E8D2A7] block">Admin</span>
              <span className="text-[10px] text-[#A8958B]">admin@textile.org</span>
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="ui-card p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#A82824]/20 border border-[#C0322D]/40 flex items-center space-x-2 text-[#FB7185] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">Email address</label>
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
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">Password</label>
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

          <div className="pt-3 text-center text-xs text-[#A8958B] border-t border-[#451F1B]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#E57365] hover:text-[#FB7185] font-semibold">
              Register here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
