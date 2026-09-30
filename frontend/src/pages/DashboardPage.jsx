import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { PredictionBadge, Badge } from '../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  ScanSearch, 
  Activity, 
  FileCheck, 
  AlertTriangle, 
  Percent, 
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  BarChart2
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const PIE_COLORS = ['#10B981', '#F43F5E'];

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader title="Dashboard" subtitle="Overview of TEX-FACTS prediction activity." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="ui-card p-6">
          <TableSkeleton rows={4} />
        </div>
      </div>
    );
  }

  const pieData = stats ? [
    { name: 'Real', value: stats.real_count },
    { name: 'Potentially Misleading', value: stats.fake_count }
  ] : [];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of TEX-FACTS prediction activity and model telemetry."
        actions={
          <Link to="/detect">
            <Button size="sm" icon={ScanSearch}>
              Analyze News
            </Button>
          </Link>
        }
      />

      {/* Row 1: 4 Compact KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Predictions"
          value={stats?.total_predictions?.toLocaleString() || '0'}
          subtitle="Processed news records"
          icon={Activity}
          accent="default"
        />
        <StatCard
          title="Real News"
          value={stats?.real_count?.toLocaleString() || '0'}
          subtitle={`${stats?.total_predictions ? Math.round((stats.real_count / stats.total_predictions) * 100) : 0}% of all samples`}
          icon={FileCheck}
          accent="emerald"
        />
        <StatCard
          title="Potentially Misleading"
          value={stats?.fake_count?.toLocaleString() || '0'}
          subtitle={`${stats?.total_predictions ? Math.round((stats.fake_count / stats.total_predictions) * 100) : 0}% flagged records`}
          icon={AlertTriangle}
          accent="rose"
        />
        <StatCard
          title="Average Confidence"
          value={`${stats?.average_confidence || 0}%`}
          subtitle="Mean class certainty"
          icon={Percent}
          accent="indigo"
        />
      </div>

      {/* Row 2: 2x2 Clean Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Real vs Potentially Misleading */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Class Proportion</h3>
            <span className="text-xs text-slate-500">Real vs Misleading</span>
          </div>

          <div className="h-60 flex items-center justify-center">
            {pieData.length > 0 && stats.total_predictions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#263244', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-slate-500">No prediction data available</span>
            )}
          </div>
        </div>

        {/* Chart 2: Prediction Activity Timeline */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Prediction Activity</h3>
            <span className="text-xs text-slate-500">Daily Timeline</span>
          </div>

          <div className="h-60">
            {stats?.predictions_timeline && stats.predictions_timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.predictions_timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263244" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#263244', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="real" stroke="#10B981" fill="#10B981" fillOpacity={0.15} name="Real" />
                  <Area type="monotone" dataKey="fake" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.15} name="Misleading" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No timeline records available
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Confidence Distribution */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Confidence Distribution</h3>
            <span className="text-xs text-slate-500">Score Range</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.confidence_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#263244" vertical={false} />
                <XAxis dataKey="range" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#263244', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} name="Samples" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Textile Sector Distribution */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Textile Sectors</h3>
            <span className="text-xs text-slate-500">Top Categories</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(stats?.category_distribution || []).slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#263244" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={75} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#263244', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#0D9488" radius={[0, 4, 4, 0]} name="Articles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Analyses Clean Table */}
      <div className="ui-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Analyses</h3>
          <Link to="/history" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center space-x-1">
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recent_predictions && stats.recent_predictions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-medium border-b border-[#263244]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Headline / Excerpt</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Prediction</th>
                  <th className="py-2.5 px-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263244]/60">
                {stats.recent_predictions.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#172033]/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{p.created_at}</td>
                    <td className="py-3 px-3 max-w-sm font-medium text-slate-200 truncate">
                      {p.title || p.text_snippet}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="default" size="sm">{p.category}</Badge>
                    </td>
                    <td className="py-3 px-3">
                      <PredictionBadge label={p.raw_label} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {p.confidence_percentage || Math.round(p.confidence * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No analyses yet"
            description="Start by analyzing your first textile news article."
            actionLabel="Analyze News"
            onAction={() => window.location.href = '/detect'}
          />
        )}
      </div>

    </div>
  );
};
