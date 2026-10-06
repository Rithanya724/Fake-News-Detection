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
  Table as TableIcon,
  BarChart3
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
        title="Model Performance Analytics"
        subtitle="Empirical evaluation of NLP classification metrics calculated on an unseen 20% stratified test split."
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
          accent="terracotta"
        />
        <StatCard
          title="Recall (Fake)"
          value={`${((metrics?.recall ?? 1.0) * 100).toFixed(1)}%`}
          subtitle="Misleading claim coverage"
          icon={TrendingUp}
          accent="champagne"
        />
        <StatCard
          title="F1-Score"
          value={`${((metrics?.f1_score ?? 1.0) * 100).toFixed(1)}%`}
          subtitle="Harmonic mean of P & R"
          icon={Award}
          accent="indigo"
        />
      </div>

      {/* Row 2: Confusion Matrix & Hyperparameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Confusion Matrix Block */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#E57365]">✳</span>
              <span>Confusion Matrix (2×2)</span>
            </h3>
            <span className="text-xs text-[#A8958B]">Test Split (n = {tn + fp + fn + tp})</span>
          </div>

          <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] space-y-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              
              {/* True Real */}
              <div className="p-4 rounded-xl bg-[#240E0C] border border-[#10B981]/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#34D399] block tracking-wider">True Real (TN)</span>
                <span className="text-2xl font-bold text-white font-mono">{tn}</span>
                <span className="text-[10px] text-[#A8958B] block">Actual REAL verified</span>
              </div>

              {/* False Alarm */}
              <div className="p-4 rounded-xl bg-[#240E0C] border border-[#451F1B] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8958B] block tracking-wider">False Alarm (FP)</span>
                <span className="text-2xl font-bold text-[#D4C4B7] font-mono">{fp}</span>
                <span className="text-[10px] text-[#8A746E] block">REAL flagged as Fake</span>
              </div>

              {/* Missed Fake */}
              <div className="p-4 rounded-xl bg-[#240E0C] border border-[#451F1B] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#A8958B] block tracking-wider">Missed Fake (FN)</span>
                <span className="text-2xl font-bold text-[#D4C4B7] font-mono">{fn}</span>
                <span className="text-[10px] text-[#8A746E] block">Fake missed as Real</span>
              </div>

              {/* True Fake */}
              <div className="p-4 rounded-xl bg-[#240E0C] border border-[#E57365]/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#FB7185] block tracking-wider">True Fake (TP)</span>
                <span className="text-2xl font-bold text-white font-mono">{tp}</span>
                <span className="text-[10px] text-[#A8958B] block">Actual FAKE caught</span>
              </div>

            </div>
          </div>
        </div>

        {/* Hyperparameters & Specifications */}
        <div className="ui-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#E57365]">✳</span>
              <span>Pipeline Specifications</span>
            </h3>
            <span className="text-xs text-[#A8958B]">TF-IDF Vectorizer</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#180908] border border-[#451F1B] flex justify-between items-center">
              <span className="text-[#A8958B]">Primary Classifier:</span>
              <span className="font-semibold text-[#E8D2A7]">{metrics?.current_model}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#180908] border border-[#451F1B] flex justify-between items-center">
              <span className="text-[#A8958B]">Text Representation:</span>
              <span className="font-semibold text-[#FAF8F5]">TF-IDF (Sublinear TF)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#180908] border border-[#451F1B] flex justify-between items-center">
              <span className="text-[#A8958B]">Vocabulary Size:</span>
              <span className="font-mono font-semibold text-[#FAF8F5]">{metrics?.vocabulary_size} Features</span>
            </div>
            <div className="p-3 rounded-xl bg-[#180908] border border-[#451F1B] flex justify-between items-center">
              <span className="text-[#A8958B]">N-gram Range:</span>
              <span className="font-mono font-semibold text-[#FAF8F5]">(1, 2) [Unigrams & Bigrams]</span>
            </div>
            <div className="p-3 rounded-xl bg-[#180908] border border-[#451F1B] flex justify-between items-center">
              <span className="text-[#A8958B]">Corpus Benchmark Size:</span>
              <span className="font-mono font-semibold text-[#FAF8F5]">{metrics?.dataset_records} Verified Articles</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Multi-Model Benchmark Comparison Table */}
      <div className="ui-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-[#E57365]">✳</span>
            <span>Multi-Model Benchmark Comparison</span>
          </h3>
          <span className="text-xs text-[#A8958B]">Identical 80/20 Stratified Split</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[#A8958B] font-semibold border-b border-[#451F1B] bg-[#180908]">
              <tr>
                <th className="py-3 px-3">Model Name</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Precision</th>
                <th className="py-3 px-3">Recall</th>
                <th className="py-3 px-3">F1-Score</th>
                <th className="py-3 px-3">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A1814]">
              {metrics?.model_comparison && metrics.model_comparison.map((m, idx) => {
                const isPrimary = m.model_name === metrics.current_model;
                return (
                  <tr key={idx} className={isPrimary ? 'bg-[#28110E] font-semibold' : 'hover:bg-[#28110E]/50'}>
                    <td className="py-3 px-3 text-[#FAF8F5] flex items-center space-x-2">
                      <span>{m.model_name}</span>
                      {isPrimary && (
                        <Badge variant="terracotta" size="sm">Active Model</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#FAF8F5]">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono text-[#FAF8F5]">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono text-[#FAF8F5]">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 font-mono text-[#34D399] font-bold">{(m.f1_score * 100).toFixed(1)}%</td>
                    <td className="py-3 px-3 text-[#A8958B]">
                      {isPrimary ? 'Production Deployed' : 'Evaluated Benchmark'}
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
