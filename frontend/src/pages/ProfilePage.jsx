import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Shield, CheckCircle, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Account Profile"
        subtitle="View your active session status and role permissions."
      />

      {/* Main Profile Card */}
      <div className="ui-card p-6 sm:p-8 space-y-6 max-w-2xl">
        
        {/* User Avatar & Info */}
        <div className="flex items-center space-x-4 pb-6 border-b border-[#263244]">
          <div className="w-12 h-12 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-lg font-bold text-emerald-400">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">{user?.name}</h2>
            <span className="text-xs text-slate-400 block">{user?.email}</span>
            <div className="pt-0.5">
              <Badge variant={user?.role === 'admin' ? 'indigo' : 'emerald'} size="sm">
                {user?.role === 'admin' ? 'ADMINISTRATOR' : 'ANALYST'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-input bg-[#172033] border border-[#263244] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] font-semibold block">Account ID</span>
            <span className="font-mono text-slate-300 truncate block">{user?.id}</span>
          </div>

          <div className="p-3.5 rounded-input bg-[#172033] border border-[#263244] space-y-1">
            <span className="text-slate-500 uppercase text-[10px] font-semibold block">Session Status</span>
            <span className="text-emerald-400 font-semibold block">Active (Expires in 24h)</span>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="p-4 rounded-input bg-[#0B1120] border border-[#263244] space-y-2 text-xs">
          <span className="font-semibold text-slate-300 block">Granted Permissions</span>
          <ul className="space-y-1.5 text-slate-400">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Direct access to NLP ML news classification engine</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Full audit history access & individual prediction deletion</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Live analytics and confusion matrix telemetry</span>
            </li>
            {user?.role === 'admin' && (
              <li className="flex items-center space-x-2 text-indigo-400">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Administrator platform monitoring & user directory</span>
              </li>
            )}
          </ul>
        </div>

        {/* Logout Action */}
        <div className="pt-2 flex justify-end">
          <Button variant="outlineDanger" size="sm" onClick={logout} icon={LogOut}>
            Sign Out
          </Button>
        </div>

      </div>

    </div>
  );
};
