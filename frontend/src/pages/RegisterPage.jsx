import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="w-9 h-9 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-emerald-400 mx-auto">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-400">Join the textile intelligence analysis platform</p>
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
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student Analyst"
                className="ui-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@university.edu"
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="ui-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Account role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Account role"
                className="ui-input text-xs"
              >
                <option value="user">Analyst (User)</option>
                <option value="admin">Administrator (Admin)</option>
              </select>
            </div>

            <Button
              type="submit"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-[#263244]">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline font-medium">
              Sign in here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
