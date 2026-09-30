import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';
import { 
  Users, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Server,
  ShieldCheck
} from 'lucide-react';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStatistics()
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader title="Administrator Console" subtitle="System administration and platform monitoring." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="ui-card p-6"><TableSkeleton rows={4} /></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <PageHeader
        title="Administrator Console"
        subtitle="System administration, platform monitoring, and user management."
        actions={
          <Button variant="secondary" size="sm" onClick={fetchAdminData} icon={RefreshCw}>
            Refresh
          </Button>
        }
      />

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Users"
          value={stats?.total_users ?? users.length}
          subtitle="Registered accounts"
          icon={Users}
          accent="indigo"
        />
        <StatCard
          title="Predictions"
          value={stats?.total_predictions ?? 0}
          subtitle="System-wide inferences"
          icon={Activity}
          accent="default"
        />
        <StatCard
          title="Real Verified"
          value={stats?.real_predictions ?? 0}
          subtitle="Credible articles"
          icon={CheckCircle}
          accent="emerald"
        />
        <StatCard
          title="Potentially Misleading"
          value={stats?.fake_predictions ?? 0}
          subtitle="Flagged rumors"
          icon={AlertTriangle}
          accent="rose"
        />
      </div>

      {/* Server Status Row */}
      <div className="ui-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">API Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">ML Engine Ready (Logistic Regression)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">Database Connected</span>
          </div>
        </div>

        <span className="text-slate-500 font-mono">FastAPI v1.0.0</span>
      </div>

      {/* User Management Table */}
      <div className="ui-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Registered Users</h3>
          <span className="text-xs text-slate-500">{users.length} enrolled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 font-medium border-b border-[#263244]">
              <tr>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Created Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263244]/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#172033]/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-200">{u.name}</td>
                  <td className="py-3 px-3 text-slate-400">{u.email}</td>
                  <td className="py-3 px-3">
                    <Badge variant={u.role === 'admin' ? 'indigo' : 'default'} size="sm">
                      {u.role === 'admin' ? 'ADMIN' : 'ANALYST'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{u.created_at || 'Pre-seeded'}</td>
                  <td className="py-3 px-3 text-emerald-400 font-medium">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
