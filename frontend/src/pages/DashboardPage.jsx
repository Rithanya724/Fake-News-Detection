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
  BarChart2,
  Sparkles
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

const PIE_COLORS = ['#10B981', '#E57365'];

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
        title="Intelligence Dashboard"
        subtitle="Overview of TEX-FACTS prediction activity, sector distributions, and model telemetry."
        actions={
          <Link to="/detect">
            <Button size="sm" icon={ScanSearch}>
              Analyze News
            </Button>
          </Link>
        }
      />

      {/* Row 1: 4 KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Predictions"
          value={stats?.total_predictions?.toLocaleString() || '0'}
          subtitle="Audited news articles"
          icon={Activity}
          accent="terracotta"
        />
        <StatCard
          title="Verified Real"
          value={stats?.real_count?.toLocaleString() || '0'}
          subtitle={`${stats?.total_predictions ? Math.round((stats.real_count / stats.total_predictions) * 100) : 0}% of all records`}
          icon={FileCheck}
          accent="emerald"
        />
        <StatCard
          title="Flagged Misleading"
          value={stats?.fake_count?.toLocaleString() || '0'}
          subtitle={`${stats?.total_predictions ? Math.round((stats.fake_count / stats.total_predictions) * 100) : 0}% misinformation alerts`}
          icon={AlertTriangle}
          accent="rose"
        />
        <StatCard
          title="Average Confidence"
          value={`${stats?.average_confidence || 0}%`}
          subtitle="Mean class certainty score"
          icon={Percent}
          accent="champagne"
        />
      </div>

      {/* Row 2: 2x2 Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Real vs Potentially Misleading */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#E57365]">✳</span>
              <span>Class Proportions</span>
            </h3>
            <span className="text-xs text-[#A8958B]">Real vs Misleading</span>
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
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="#240E0C" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C0B0A', borderColor: '#451F1B', borderRadius: '12px', fontSize: '12px', color: '#FAF8F5' }}
                  />
                  <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: '12px', color: '#D4C4B7' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-[#A8958B]">No prediction data available</span>
            )}
          </div>
        </div>

        {/* Chart 2: Prediction Activity Timeline */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#E57365]">✳</span>
              <span>Audit Timeline</span>
            </h3>
            <span className="text-xs text-[#A8958B]">Daily Activity</span>
          </div>

          <div className="h-60">
            {stats?.predictions_timeline && stats.predictions_timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.predictions_timeline}>
                  <defs>
                    <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="fakeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E57365" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#E57365" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A1814" vertical={false} />
                  <XAxis dataKey="date" stroke="#A8958B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#A8958B" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1C0B0A', borderColor: '#451F1B', borderRadius: '12px', fontSize: '12px', color: '#FAF8F5' }} />
                  <Area type="monotone" dataKey="real" stroke="#10B981" fillOpacity={1} fill="url(#realGrad)" name="Real" />
                  <Area type="monotone" dataKey="fake" stroke="#E57365" fillOpacity={1} fill="url(#fakeGrad)" name="Misleading" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#A8958B]">
                No timeline records available
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Confidence Distribution */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#E57365]">✳</span>
              <span>Confidence Distribution</span>
            </h3>
            <span className="text-xs text-[#A8958B]">Score Range</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.confidence_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A1814" vertical={false} />
                <XAxis dataKey="range" stroke="#A8958B" fontSize={11} tickLine={false} />
                <YAxis stroke="#A8958B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1C0B0A', borderColor: '#451F1B', borderRadius: '12px', fontSize: '12px', color: '#FAF8F5' }} />
                <Bar dataKey="count" fill="#843932" radius={[6, 6, 0, 0]} name="Samples" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Textile Sector Distribution */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#E57365]">✳</span>
              <span>Textile Sectors</span>
            </h3>
            <span className="text-xs text-[#A8958B]">Top Categories</span>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={(stats?.category_distribution || []).slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#3A1814" horizontal={false} />
                <XAxis type="number" stroke="#A8958B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#FAF8F5" fontSize={11} width={85} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1C0B0A', borderColor: '#451F1B', borderRadius: '12px', fontSize: '12px', color: '#FAF8F5' }} />
                <Bar dataKey="value" fill="#C59B5D" radius={[0, 6, 6, 0]} name="Articles" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Analyses Table */}
      <div className="ui-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-[#E57365]">✳</span>
            <span>Recent Audits</span>
          </h3>
          <Link to="/history" className="text-xs text-[#E57365] hover:text-[#FB7185] font-semibold inline-flex items-center space-x-1">
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recent_predictions && stats.recent_predictions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#A8958B] font-semibold border-b border-[#451F1B] bg-[#180908]">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Headline / Excerpt</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Prediction</th>
                  <th className="py-3 px-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A1814]">
                {stats.recent_predictions.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#28110E] transition-colors">
                    <td className="py-3 px-3 text-[#A8958B] whitespace-nowrap font-mono text-[11px]">{p.created_at}</td>
                    <td className="py-3 px-3 max-w-sm font-medium text-[#FAF8F5] truncate">
                      {p.title || p.text_snippet}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="default" size="sm">{p.category}</Badge>
                    </td>
                    <td className="py-3 px-3">
                      <PredictionBadge label={p.raw_label} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono text-[#E8D2A7] font-semibold">
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
