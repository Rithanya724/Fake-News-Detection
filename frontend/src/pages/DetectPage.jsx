import React, { useState } from 'react';
import { predictionAPI } from '../services/api';
import { ExplainabilitySignals } from '../components/ExplainabilitySignals';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { PredictionBadge } from '../components/ui/Badge';
import { ConfidenceBar } from '../components/ui/ConfidenceBar';
import { 
  ScanSearch, 
  RotateCcw, 
  AlertCircle, 
  BarChart3
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const QUICK_EXAMPLES = [
  // Cotton - Real
  {
    label: "Cotton MSP Procurement",
    category: "Cotton",
    isFake: false,
    title: "Cotton Corporation of India announces MSP procurement schedule",
    text: "The Cotton Corporation of India has formally released the schedule for Minimum Support Price procurement operations across major cotton-growing states including Gujarat and Maharashtra to safeguard farmer interests.",
    source: "Ministry of Textiles Gazette"
  },
  // Cotton - Fake
  {
    label: "Midnight Export Ban Hoax",
    category: "Cotton",
    isFake: true,
    title: "Government bans 100% of cotton exports overnight",
    text: "URGENT BREAKING: The government has issued an emergency midnight notification banning 100 percent of raw cotton and yarn exports indefinitely! Mill owners across the nation are shutting doors permanently as prices plummet to zero rupees tomorrow morning!",
    source: "Viral WhatsApp Forward"
  },
  // Silk - Real
  {
    label: "Silk Board Mulberry Yields",
    category: "Silk",
    isFake: false,
    title: "Central Silk Board reports 8% growth in mulberry cocoon production",
    text: "The Central Silk Board announced an 8 percent increase in mulberry raw silk production in Karnataka and Tamil Nadu. Modernized rearing houses and improved bi-voltine silkworm breeds contributed significantly to higher yields and tensile fiber strength.",
    source: "Sericulture Development Bulletin"
  },
  // Silk - Fake
  {
    label: "Zero Duty Silk Scam Hoax",
    category: "Silk",
    isFake: true,
    title: "All import duty on raw silk abolished permanently with instant cash refund",
    text: "SHOCKING ANNOUNCEMENT: Finance ministry eliminates 100% of custom duties on foreign raw silk effective immediately! All registered weavers can claim direct 2 lakh rupee cash transfer by registering on unverified telegram channel today!",
    source: "Telegram Rumor Group"
  },
  // Technical Textiles - Real
  {
    label: "National Tech Textiles Grant",
    category: "Technical Textiles",
    isFake: false,
    title: "Government approves Rs 300 crore R&D grants under NTTM for geotextiles",
    text: "The Ministry of Textiles has officially cleared 15 research and development projects worth Rs 300 crore under the National Technical Textiles Mission focusing on specialty medical garments, agrotextiles, and high-tensile geotextile reinforcements.",
    source: "Press Information Bureau (PIB)"
  },
  // Synthetic / Polyester - Fake
  {
    label: "Exploding Fabric Panic",
    category: "Synthetic",
    isFake: true,
    title: "WHO declares all synthetic polyester fabrics illegal worldwide",
    text: "SHOCKING ALERT: The World Health Organization has banned all polyester, nylon, and synthetic garments worldwide! Secret chemicals in polyester yarns cause clothes to burst into flames under direct sunlight. Burn all polyester clothes immediately!",
    source: "Sensational Viral Alerts"
  },
  // Policy / Subsidies - Real
  {
    label: "PLI Scheme Disbursals",
    category: "Policy",
    isFake: false,
    title: "Textile PLI Scheme disburses incentives to 64 approved manufacturing applicants",
    text: "The Ministry of Textiles confirmed that 64 participants under the Production Linked Incentive (PLI) Scheme for man-made fibre apparel and technical textiles have completed stage-1 investment audits and are receiving quarterly capital subsidies.",
    source: "Textile Trade Directorate"
  },
  // Policy / Subsidies - Fake
  {
    label: "Secret 50 Lakh Subsidy Scam",
    category: "Policy",
    isFake: true,
    title: "Emergency 50 Lakh cash subsidy declared for any powerloom owner without paperwork",
    text: "CLAIM: Prime Minister announces instant 50 lakh rupee financial grant directly deposited to bank accounts of all small powerloom operators tomorrow without any verification, documentation, or GST return filings. Click link to claim now!",
    source: "Clickbait Blog Network"
  },
  // Jute - Real
  {
    label: "Jute Packaging Mandate",
    category: "Jute",
    isFake: false,
    title: "Cabinet approves mandatory 100% jute packaging for foodgrains and 20% for sugar",
    text: "The Cabinet Committee on Economic Affairs chaired by the Prime Minister has approved mandatory packaging norms reserving 100 percent of foodgrains and 20 percent of refined sugar in eco-friendly diversified jute bags for the current sugar season.",
    source: "Ministry of Consumer Affairs"
  },
  // Garments / Export - Real
  {
    label: "Tirupur Knitwear Exports",
    category: "Garments",
    isFake: false,
    title: "Tirupur apparel cluster registers 14% export rebound following EU trade accord",
    text: "Textile exporters in the Tirupur knitwear manufacturing hub witnessed a 14 percent year-on-year surge in garment export shipments to European markets, driven by sustainable zero-liquid-discharge processing compliance.",
    source: "Apparel Export Promotion Council (AEPC)"
  },
  // Man-Made Fibers - Real
  {
    label: "Viscose Staple Quality Order",
    category: "Yarn",
    isFake: false,
    title: "Bureau of Indian Standards implements mandatory QCO norms for Viscose Staple Fibre",
    text: "The Ministry of Textiles in consultation with BIS has enforced Quality Control Orders (QCO) for viscose staple fibres to ensure standard tensile strength, fiber uniformity, and check substandard synthetic imports.",
    source: "Official Gazette Notification"
  },
  // Sustainability - Fake
  {
    label: "Red Fabric Toxic Ban Hoax",
    category: "Sustainability",
    isFake: true,
    title: "Government orders immediate seizure of all red dyed textile garments",
    text: "URGENT WARNING: Medical regulators discover red azo dyes in all cotton clothing cause immediate skin disease! Police ordered to confiscate all red shirts and dresses across retail stores by Friday morning! Do not wear red!",
    source: "Social Media Forward"
  }
];

const CATEGORY_TABS = ['All', 'Cotton', 'Silk', 'Policy', 'Technical Textiles', 'Synthetic', 'Jute', 'Garments', 'Yarn', 'Sustainability'];

export const DetectPage = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
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

  const filteredExamples = selectedCategoryTab === 'All' 
    ? QUICK_EXAMPLES 
    : QUICK_EXAMPLES.filter(ex => ex.category.toLowerCase() === selectedCategoryTab.toLowerCase());

  // Chart data helpers
  const isFakeResult = result?.raw_label === 'FAKE';
  const confidenceVal = result ? (result.confidence_percentage || Math.round(result.confidence * 100)) : 0;
  const realProbability = isFakeResult ? Math.max(100 - confidenceVal, 2) : confidenceVal;
  const fakeProbability = isFakeResult ? confidenceVal : Math.max(100 - confidenceVal, 2);

  const probabilityPieData = [
    { name: 'Real News', value: Number(realProbability.toFixed(1)), color: '#10B981' },
    { name: 'Misleading', value: Number(fakeProbability.toFixed(1)), color: '#E57365' },
  ];

  // Feature signals chart data
  const signalsBarData = result?.important_signals ? result.important_signals.map(s => ({
    name: s.feature,
    weight: Number(s.weight.toFixed(4)),
    absWeight: Math.abs(Number(s.weight.toFixed(4))),
    indicator: s.indicator,
    isCredible: s.indicator === 'Credible Indicator' || s.weight > 0,
  })) : [];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <PageHeader
        title="Analyze Textile News"
        subtitle="Submit an article headline or excerpt to generate empirical ML classification, probability distributions, and visual signal charts."
      />

      {/* 1. Quick Example Preset Library with Category Tabs */}
      <div className="ui-card p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[#E57365] text-sm">✳</span>
            <span className="text-xs font-bold text-[#EDE3D8] uppercase tracking-wider">
              Quick Test Library (Real & Fake Data Presets)
            </span>
          </div>
          <span className="text-[11px] text-[#A8958B]">
            Click any sample to autofill the verification form
          </span>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-[#451F1B] pb-2.5">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedCategoryTab(tab)}
              className={`px-3 py-1 rounded-pill text-[11px] font-medium transition-colors cursor-pointer ${
                selectedCategoryTab === tab
                  ? 'bg-[#843932] text-white border border-[#9E4238]/60 font-semibold'
                  : 'bg-[#180908] text-[#A8958B] hover:text-[#EDE3D8] border border-[#451F1B]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Preset Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
          {filteredExamples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadExample(ex)}
              className="p-2.5 rounded-xl bg-[#180908] hover:bg-[#28110E] border border-[#451F1B] hover:border-[#68312B] text-left transition-all group cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[#D4C4B7] uppercase tracking-wider">
                  {ex.category}
                </span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  ex.isFake ? 'bg-[#BA4E42]/20 text-[#FB7185]' : 'bg-[#10B981]/20 text-[#34D399]'
                }`}>
                  {ex.isFake ? 'FAKE' : 'REAL'}
                </span>
              </div>
              <p className="text-xs font-medium text-[#EDE3D8] group-hover:text-white line-clamp-1">
                {ex.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Workspace Input Form */}
      <div className="ui-card p-6 sm:p-8 space-y-5">
        {error && (
          <div className="p-3.5 rounded-input bg-[#A82824]/20 border border-[#C0322D]/40 text-[#FB7185] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FB7185]" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">
                Headline / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cotton Corporation of India announces MSP procurement"
                className="ui-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4C4B7] mb-1.5">
                Source Publication (Optional)
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Ministry of Textiles Gazette / Press Release"
                className="ui-input"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#D4C4B7]">
                Article Text or Claim Body <span className="text-[#E57365]">*</span>
              </label>
              <span className="text-[11px] text-[#A8958B] font-mono">
                {text.length} characters (minimum 15)
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

          <div className="flex items-center justify-end space-x-3 pt-2">
            {text && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                icon={RotateCcw}
              >
                Clear Form
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

      {/* 3. Analysis Results Section with Interactive Charts & Graphs */}
      {result && (
        <div className="ui-card-elevated p-6 sm:p-8 space-y-8 border-[#68312B]">
          
          {/* Result Header Bar */}
          <div className="space-y-4 pb-6 border-b border-[#451F1B]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#A8958B] uppercase font-bold tracking-wider block">
                  Model Prediction Outcome
                </span>
                <div className="flex items-center gap-3">
                  <PredictionBadge label={result.raw_label} size="md" />
                  <span className="text-xs text-[#D4C4B7]">
                    Processed via <strong>{result.model}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="px-3 py-2 rounded-xl bg-[#180908] border border-[#451F1B]">
                  <span className="text-[10px] text-[#A8958B] uppercase block font-semibold">Category</span>
                  <span className="font-bold text-white">{result.category}</span>
                </div>

                <div className="px-3 py-2 rounded-xl bg-[#180908] border border-[#451F1B]">
                  <span className="text-[10px] text-[#A8958B] uppercase block font-semibold">Certainty</span>
                  <span className="font-bold font-mono text-[#E8D2A7]">{confidenceVal}%</span>
                </div>
              </div>
            </div>

            {/* Horizontal Confidence Bar */}
            <div className="pt-2 max-w-lg">
              <ConfidenceBar
                percentage={result.confidence_percentage}
                isFake={result.raw_label === 'FAKE'}
              />
            </div>
          </div>

          {/* VISUAL CHARTS GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#E57365]" />
                <span>Empirical Result Visualizations</span>
              </h3>
              <span className="text-xs text-[#A8958B]">Interactive Recharts Engine</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Chart 1: Probability Distribution Donut Chart */}
              <div className="p-5 rounded-2xl bg-[#180908] border border-[#451F1B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Class Probability Breakdown
                  </span>
                  <span className="text-[11px] text-[#A8958B]">Softmax / Sigmoid</span>
                </div>

                <div className="h-56 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={probabilityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {probabilityPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#180908" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'Likelihood']}
                        contentStyle={{
                          backgroundColor: '#240E0C',
                          borderColor: '#451F1B',
                          borderRadius: '12px',
                          color: '#FAF8F5',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-bold font-mono text-white">{confidenceVal}%</span>
                    <span className="text-[9px] text-[#A8958B] uppercase font-bold">
                      {isFakeResult ? 'Misleading' : 'Real'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-around text-xs border-t border-[#3A1814] pt-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span className="text-[#D4C4B7]">Real: <strong>{realProbability.toFixed(1)}%</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E57365]" />
                    <span className="text-[#D4C4B7]">Misleading: <strong>{fakeProbability.toFixed(1)}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Feature Signal Impact Weights (Horizontal Bar Chart) */}
              <div className="p-5 rounded-2xl bg-[#180908] border border-[#451F1B] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Feature Log-Odds Impact
                  </span>
                  <span className="text-[11px] text-[#A8958B]">Top NLP Signals</span>
                </div>

                {signalsBarData.length > 0 ? (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={signalsBarData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#3A1814" horizontal={false} />
                        <XAxis type="number" stroke="#A8958B" fontSize={10} />
                        <YAxis dataKey="name" type="category" stroke="#FAF8F5" fontSize={11} width={80} />
                        <Tooltip
                          formatter={(val, name, item) => [
                            `${item.payload.weight > 0 ? '+' : ''}${item.payload.weight}`,
                            item.payload.indicator
                          ]}
                          contentStyle={{
                            backgroundColor: '#240E0C',
                            borderColor: '#451F1B',
                            borderRadius: '12px',
                            color: '#FAF8F5',
                            fontSize: '12px'
                          }}
                        />
                        <Bar
                          dataKey="absWeight"
                          radius={[0, 6, 6, 0]}
                        >
                          {signalsBarData.map((entry, index) => (
                            <Cell key={`bar-${index}`} fill={entry.isCredible ? '#10B981' : '#E57365'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-56 flex items-center justify-center text-xs text-[#A8958B]">
                    No significant statistical token weights detected
                  </div>
                )}

                <div className="flex justify-around text-xs border-t border-[#3A1814] pt-3 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#10B981]" />
                    <span className="text-[#D4C4B7]">Green: Credible Signal</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#E57365]" />
                    <span className="text-[#D4C4B7]">Red: Misleading Signal</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Feature Explainability Signals Table / List */}
          <ExplainabilitySignals signals={result.important_signals} />

          {/* Research Notice */}
          <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] text-xs text-[#A8958B] space-y-1">
            <span className="font-bold text-[#EDE3D8] block flex items-center gap-1.5">
              <span className="text-[#E57365]">✳</span> Academic Research Notice:
            </span>
            <p className="leading-relaxed text-[11px]">{result.notice}</p>
          </div>

        </div>
      )}

    </div>
  );
};
