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
        subtitle="View your active session status, granted permissions, and audit credentials."
      />

      {/* Main Profile Card */}
      <div className="ui-card p-6 sm:p-8 space-y-6 max-w-2xl">
        
        {/* User Avatar & Info */}
        <div className="flex items-center space-x-4 pb-6 border-b border-[#451F1B]">
          <div className="w-14 h-14 rounded-2xl bg-[#180908] border border-[#5A2C26] flex items-center justify-center text-xl font-bold text-[#E57365] shadow-subtle">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <span className="text-xs text-[#A8958B] block">{user?.email}</span>
            <div className="pt-1">
              <Badge variant={user?.role === 'admin' ? 'champagne' : 'emerald'} size="sm">
                {user?.role === 'admin' ? 'ADMINISTRATOR' : 'ANALYST'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B] space-y-1">
            <span className="text-[#A8958B] uppercase text-[10px] font-bold block">Account ID</span>
            <span className="font-mono text-[#FAF8F5] truncate block">{user?.id}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B] space-y-1">
            <span className="text-[#A8958B] uppercase text-[10px] font-bold block">Session Status</span>
            <span className="text-[#34D399] font-bold block">Active (Expires in 24h)</span>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] space-y-2 text-xs">
          <span className="font-bold text-[#EDE3D8] block flex items-center gap-1.5">
            <span className="text-[#E57365]">✳</span> Granted Capabilities:
          </span>
          <ul className="space-y-2 text-[#A8958B]">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
              <span>Full NLP news classification and signal explainability engine</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
              <span>Audit history search, filtering, and export capabilities</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
              <span>Model performance telemetry and confusion matrix inspection</span>
            </li>
            {user?.role === 'admin' && (
              <li className="flex items-center space-x-2 text-[#E8D2A7]">
                <CheckCircle className="w-3.5 h-3.5 text-[#E8D2A7] shrink-0" />
                <span>Administrator user directory and system-wide monitoring</span>
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
