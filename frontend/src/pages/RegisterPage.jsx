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
          <div className="w-10 h-10 rounded-pill bg-[#28110E] border border-[#5A2C26] flex items-center justify-center text-[#E57365] mx-auto shadow-subtle">
            <span className="text-xl font-bold">✳</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Create an Account</h2>
          <p className="text-xs text-[#A8958B]">Join the textile intelligence platform</p>
        </div>

        {/* Main Form */}
        <div className="ui-card p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#A82824]/20 border border-[#C0322D]/40 flex items-center space-x-2 text-[#FB7185] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">Full name</label>
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
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">Email address</label>
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

            <div>
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">Confirm password</label>
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
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">Account role</label>
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

          <div className="pt-3 text-center text-xs text-[#A8958B] border-t border-[#451F1B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E57365] hover:text-[#FB7185] font-semibold">
              Sign in here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
