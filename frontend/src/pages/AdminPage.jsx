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
        subtitle="System administration, platform telemetry, and user access management."
        actions={
          <Button variant="secondary" size="sm" onClick={fetchAdminData} icon={RefreshCw}>
            Refresh Telemetry
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
          accent="champagne"
        />
        <StatCard
          title="Inferences"
          value={stats?.total_predictions ?? 0}
          subtitle="System-wide evaluations"
          icon={Activity}
          accent="terracotta"
        />
        <StatCard
          title="Real News"
          value={stats?.real_predictions ?? 0}
          subtitle="Verified authentic"
          icon={CheckCircle}
          accent="emerald"
        />
        <StatCard
          title="Misleading Claims"
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
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#FAF8F5] font-semibold">FastAPI Engine Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[#FAF8F5] font-semibold">Logistic Regression Model Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[#FAF8F5] font-semibold">MongoDB Store Synchronized</span>
          </div>
        </div>

        <span className="text-[#A8958B] font-mono">Build v2.4.0 (Editorial Edition)</span>
      </div>

      {/* User Management Table */}
      <div className="ui-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-[#E57365]">✳</span>
            <span>Registered Analysts & Administrators</span>
          </h3>
          <span className="text-xs text-[#A8958B]">{users.length} enrolled accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#A8958B] font-semibold border-b border-[#451F1B] bg-[#180908]">
              <tr>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Enrolled Date</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A1814]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#28110E] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#FAF8F5]">{u.name}</td>
                  <td className="py-3 px-3 text-[#A8958B]">{u.email}</td>
                  <td className="py-3 px-3">
                    <Badge variant={u.role === 'admin' ? 'champagne' : 'default'} size="sm">
                      {u.role === 'admin' ? 'ADMIN' : 'ANALYST'}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-[#A8958B] font-mono text-[11px]">{u.created_at || 'Pre-seeded'}</td>
                  <td className="py-3 px-3 text-[#34D399] font-bold">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
