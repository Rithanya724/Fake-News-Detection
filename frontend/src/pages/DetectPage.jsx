import React, { useState } from 'react';
import { predictionAPI } from '../services/api';
import { ExplainabilitySignals } from '../components/ExplainabilitySignals';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge, PredictionBadge } from '../components/ui/Badge';
import { ConfidenceBar } from '../components/ui/ConfidenceBar';
import { 
  ScanSearch, 
  RotateCcw, 
  AlertCircle, 
  FileText, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const QUICK_EXAMPLES = [
  {
    label: "Cotton MSP (Real)",
    category: "Cotton",
    isFake: false,
    title: "Cotton Corporation of India announces MSP procurement schedule",
    text: "The Cotton Corporation of India has formally released the schedule for Minimum Support Price procurement operations across major cotton-growing states including Gujarat and Maharashtra to safeguard farmer interests.",
    source: "Textile Ministry Bulletin"
  },
  {
    label: "Export Ban Hoax (Misleading)",
    category: "Cotton",
    isFake: true,
    title: "Government bans 100% of cotton exports overnight",
    text: "URGENT BREAKING: The government has issued an emergency midnight notification banning 100 percent of raw cotton and yarn exports indefinitely! Mill owners across the nation are shutting doors permanently as prices plummet to zero rupees tomorrow morning!",
    source: "Viral WhatsApp Forward"
  },
  {
    label: "Silk Yields (Real)",
    category: "Silk",
    isFake: false,
    title: "Central Silk Board reports 8% growth in mulberry cocoon production",
    text: "The Central Silk Board announced an 8 percent increase in mulberry raw silk production in Karnataka and Tamil Nadu. Modernized rearing houses and improved bi-voltine silkworm breeds contributed significantly to the higher yield and tensile strength.",
    source: "Sericulture Development Board"
  },
  {
    label: "Exploding Fabric Hoax (Misleading)",
    category: "Fabrics",
    isFake: true,
    title: "WHO declares all synthetic polyester fabrics illegal worldwide",
    text: "SHOCKING ALERT: The World Health Organization has banned all polyester, nylon, and synthetic garments worldwide! Secret chemicals in polyester yarns cause clothes to burst into flames under direct sunlight. Burn all polyester clothes immediately!",
    source: "Sensational Viral Alerts"
  }
];

export const DetectPage = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!text || text.trim().length < 15) {
      setError('Please provide at least 15 characters of textile news text.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await predictionAPI.predict({ text, title, source });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis service temporarily unreachable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example) => {
    setTitle(example.title);
    setText(example.text);
    setSource(example.source);
    setError('');
    setResult(null);
  };

  const handleClear = () => {
    setText('');
    setTitle('');
    setSource('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <PageHeader
        title="Analyze Textile News"
        subtitle="Enter an article headline or excerpt to generate an empirical ML classification and feature signal breakdown."
      />

      {/* Quick Example Selector */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-slate-400">Quick examples:</span>
        <div className="flex flex-wrap gap-2">
          {QUICK_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadExample(ex)}
              className="px-3 py-1.5 rounded-md bg-[#111827] hover:bg-[#172033] border border-[#263244] hover:border-slate-600 text-xs text-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${ex.isFake ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <span>{ex.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Form */}
      <div className="ui-card p-6 space-y-4">
        {error && (
          <div className="p-3 rounded-input bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Headline / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cotton exports surge 22% in quarterly review"
                className="ui-input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Source Publication (Optional)
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Apparel & Textile Trade Daily"
                className="ui-input"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Article Text <span className="text-emerald-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {text.length} characters (min 15)
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste textile news report, press release, government scheme update, or trader forum claim here..."
              className="ui-input leading-relaxed resize-y"
            />
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-2">
            {text && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                icon={RotateCcw}
              >
                Clear
              </Button>
            )}

            <Button
              type="submit"
              size="md"
              loading={loading}
              disabled={!text.trim() || text.trim().length < 15}
              icon={ScanSearch}
            >
              Analyze News
            </Button>
          </div>
        </form>
      </div>

      {/* Analysis Result Display */}
      {result && (
        <div className="ui-card p-6 sm:p-8 space-y-6 border-emerald-500/40">
          
          {/* Result Header */}
          <div className="space-y-3 pb-6 border-b border-[#263244]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Analysis Result
            </span>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Model Prediction</span>
                <PredictionBadge label={result.raw_label} size="md" />
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="p-2.5 rounded-input bg-[#172033] border border-[#263244]">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Category</span>
                  <span className="font-semibold text-slate-200">{result.category}</span>
                </div>

                <div className="p-2.5 rounded-input bg-[#172033] border border-[#263244]">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Model</span>
                  <span className="font-semibold text-slate-200">{result.model}</span>
                </div>
              </div>
            </div>

            {/* Horizontal Confidence Bar */}
            <div className="pt-2 max-w-md">
              <ConfidenceBar
                percentage={result.confidence_percentage}
                isFake={result.raw_label === 'FAKE'}
              />
            </div>
          </div>

          {/* Feature Explainability Evidence */}
          <ExplainabilitySignals signals={result.important_signals} />

          {/* Research Notice */}
          <div className="p-3.5 rounded-input bg-[#172033] border border-[#263244] text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Notice:</span>
            <p className="leading-relaxed text-[11px]">{result.notice}</p>
          </div>

        </div>
      )}

    </div>
  );
};
