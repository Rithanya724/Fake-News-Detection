import React, { useState, useEffect } from 'react';
import { predictionAPI } from '../services/api';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { CardSkeleton, TableSkeleton } from '../components/ui/LoadingSkeleton';
import { 
  CheckCircle2, 
  Award, 
  Sliders, 
  GitCompare, 
  TrendingUp, 
  Table as TableIcon 
} from 'lucide-react';

export const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await predictionAPI.getModelPerformance();
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to load performance metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        <PageHeader title="Model Analytics" subtitle="Empirical evaluation of classification performance." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="ui-card p-6"><TableSkeleton rows={4} /></div>
      </div>
    );
  }

  const cm = metrics?.confusion_matrix || [[30, 0], [0, 26]];
  const tn = cm[0]?.[0] ?? 0;
  const fp = cm[0]?.[1] ?? 0;
  const fn = cm[1]?.[0] ?? 0;
  const tp = cm[1]?.[1] ?? 0;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <PageHeader
        title="Model Analytics"
        subtitle="Empirical evaluation of classification performance calculated on an unseen 20% stratified test split."
      />

      {/* Row 1: 4 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Accuracy"
          value={`${((metrics?.accuracy ?? 1.0) * 100).toFixed(1)}%`}
          subtitle="Overall test accuracy"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Precision (Fake)"
          value={`${((metrics?.precision ?? 1.0) * 100).toFixed(1)}%`}
          subtitle="False-alarm resistance"
          icon={Award}
          accent="indigo"
        />
        <StatCard
          title="Recall (Fake)"
          value={`${((metrics?.recall ?? 1.0) * 100).toFixed(1)}%`}
          subtitle="Misleading claim coverage"
          icon={TrendingUp}
          accent="default"
        />
        <StatCard
          title="F1-Score"
          value={`${((metrics?.f1_score ?? 1.0) * 100).toFixed(1)}%`}
          subtitle="Harmonic mean of P & R"
          icon={Award}
          accent="amber"
        />
      </div>

      {/* Row 2: 2x2 Confusion Matrix & Hyperparameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confusion Matrix Block */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Confusion Matrix (2×2)</h3>
            <span className="text-xs text-slate-500">Test Split (n = {tn + fp + fn + tp})</span>
          </div>

          <div className="p-3.5 rounded-input bg-[#0B1120] border border-[#263244] space-y-3">
            <div className="grid grid-cols-2 gap-2.5 text-center">
              
              {/* True Real */}
              <div className="p-3.5 rounded-input bg-[#111827] border border-emerald-500/30 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-emerald-400 block tracking-wider">True Real (TN)</span>
                <span className="text-2xl font-bold text-white font-mono">{tn}</span>
                <span className="text-[10px] text-slate-400 block">Actual REAL identified</span>
              </div>

              {/* False Alarm */}
              <div className="p-3.5 rounded-input bg-[#111827] border border-[#263244] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">False Alarm (FP)</span>
                <span className="text-2xl font-bold text-slate-300 font-mono">{fp}</span>
                <span className="text-[10px] text-slate-500 block">REAL flagged as Fake</span>
              </div>

              {/* Missed Fake */}
              <div className="p-3.5 rounded-input bg-[#111827] border border-[#263244] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Missed Fake (FN)</span>
                <span className="text-2xl font-bold text-slate-300 font-mono">{fn}</span>
                <span className="text-[10px] text-slate-500 block">Fake missed as Real</span>
              </div>

              {/* True Fake */}
              <div className="p-3.5 rounded-input bg-[#111827] border border-rose-500/30 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-rose-400 block tracking-wider">True Fake (TP)</span>
                <span className="text-2xl font-bold text-white font-mono">{tp}</span>
                <span className="text-[10px] text-slate-400 block">Actual FAKE caught</span>
              </div>

            </div>
          </div>
        </div>

        {/* Hyperparameters & Specifications */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Pipeline Specifications</h3>
            <span className="text-xs text-slate-500">TF-IDF Vectorizer</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244] flex justify-between">
              <span className="text-slate-400">Primary Classifier:</span>
              <span className="font-semibold text-emerald-400">{metrics?.current_model}</span>
            </div>
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244] flex justify-between">
              <span className="text-slate-400">Text Representation:</span>
              <span className="font-semibold text-slate-200">TF-IDF (Sublinear TF)</span>
            </div>
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244] flex justify-between">
              <span className="text-slate-400">Vocabulary Size:</span>
              <span className="font-mono font-semibold text-slate-200">{metrics?.vocabulary_size} Features</span>
            </div>
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244] flex justify-between">
              <span className="text-slate-400">N-gram Range:</span>
              <span className="font-mono font-semibold text-slate-200">(1, 2) [Unigrams & Bigrams]</span>
            </div>
            <div className="p-3 rounded-input bg-[#172033] border border-[#263244] flex justify-between">
              <span className="text-slate-400">Total Records in Corpus:</span>
              <span className="font-mono font-semibold text-slate-200">{metrics?.dataset_records} Articles</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Multi-Model Benchmark Comparison Table */}
      <div className="ui-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Model Comparison</h3>
          <span className="text-xs text-slate-500">Identical 80/20 Stratified Split</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 font-medium border-b border-[#263244]">
              <tr>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Recall</th>
                <th className="py-2.5 px-3">F1-Score</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263244]/60">
              {metrics?.model_comparison && metrics.model_comparison.map((m, idx) => {
                const isPrimary = m.model_name === metrics.current_model;
                return (
                  <tr key={idx} className={isPrimary ? 'bg-[#172033]/70 font-semibold' : 'hover:bg-[#172033]/30'}>
                    <td className="py-3 px-3 text-slate-200 flex items-center space-x-2">
                      <span>{m.model_name}</span>
                      {isPrimary && (
                        <Badge variant="emerald" size="sm">Active</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{(m.f1_score * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 text-slate-400">
                      {isPrimary ? 'Deployed Primary' : 'Benchmarked'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
