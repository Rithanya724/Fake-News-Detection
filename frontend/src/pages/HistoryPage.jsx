import React, { useState, useEffect, useMemo } from 'react';
import { historyAPI } from '../services/api';
import { ExplainabilitySignals } from '../components/ExplainabilitySignals';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge, PredictionBadge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { 
  Search, 
  Trash2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BarChart2,
  Sparkles,
  RotateCcw,
  Download
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';

const CATEGORIES = [
  'All', 'Cotton', 'Silk', 'Wool', 'Yarn', 'Fabrics', 'Garments',
  'Machinery', 'Subsidies', 'Policy', 'Prices', 'Sustainability', 'Technical Textiles', 'Exports', 'Synthetic'
];

const QUICK_TAGS = [
  'Cotton MSP', 'Export Ban', 'Silk Board', 'Subsidies', 'Polyester', 'QCO', 'Jute', 'Tirupur'
];

export const HistoryPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [predictionFilter, setPredictionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [confidenceTier, setConfidenceTier] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showCharts, setShowCharts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        search: search || undefined,
        prediction: predictionFilter || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
      };
      const res = await historyAPI.getHistory(params);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, predictionFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleQuickTag = (tag) => {
    setSearch(tag);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setPredictionFilter('');
    setCategoryFilter('All');
    setConfidenceTier('All');
    setSortBy('newest');
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await historyAPI.delete(id);
      setDeleteConfirmId(null);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      fetchHistory();
    } catch (err) {
      alert('Failed to delete history item.');
    }
  };

  // Client-side confidence tier & sort processing on current page results
  const processedItems = useMemo(() => {
    let list = [...items];

    if (confidenceTier === 'high') {
      list = list.filter(i => (i.confidence_percentage || i.confidence * 100) >= 80);
    } else if (confidenceTier === 'medium') {
      list = list.filter(i => {
        const c = (i.confidence_percentage || i.confidence * 100);
        return c >= 60 && c < 80;
      });
    } else if (confidenceTier === 'low') {
      list = list.filter(i => (i.confidence_percentage || i.confidence * 100) < 60);
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    } else if (sortBy === 'conf_high') {
      list.sort((a, b) => (b.confidence_percentage || b.confidence * 100) - (a.confidence_percentage || a.confidence * 100));
    } else if (sortBy === 'conf_low') {
      list.sort((a, b) => (a.confidence_percentage || a.confidence * 100) - (b.confidence_percentage || b.confidence * 100));
    }

    return list;
  }, [items, confidenceTier, sortBy]);

  // Dynamic statistics from current dataset
  const realCount = items.filter(i => i.raw_label === 'REAL').length;
  const fakeCount = items.filter(i => i.raw_label === 'FAKE').length;
  const avgConfidence = items.length > 0 
    ? Math.round(items.reduce((acc, curr) => acc + (curr.confidence_percentage || curr.confidence * 100), 0) / items.length)
    : 0;

  const miniPieData = [
    { name: 'Real', value: realCount, color: '#10B981' },
    { name: 'Misleading', value: fakeCount, color: '#E57365' },
  ];

  // Category distribution for chart
  const categoryCounts = useMemo(() => {
    const counts = {};
    items.forEach(i => {
      const cat = i.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).slice(0, 5);
  }, [items]);

  // Export to CSV helper
  const handleExportCSV = () => {
    if (!items.length) return;
    const headers = ["ID", "Date", "Title", "Category", "Prediction", "Confidence", "Model"];
    const rows = items.map(i => [
      `"${i.id}"`,
      `"${i.created_at || ''}"`,
      `"${(i.title || i.text_snippet || '').replace(/"/g, '""')}"`,
      `"${i.category || ''}"`,
      `"${i.raw_label || i.prediction}"`,
      `"${i.confidence_percentage || Math.round(i.confidence * 100)}%"`,
      `"${i.model || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `texfacts_history_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header with Export & Chart Toggle */}
      <PageHeader
        title="Prediction Audit History"
        subtitle="Search and review previous NLP classifications, confidence telemetry, and feature evidence."
        actions={
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon={BarChart2}
              onClick={() => setShowCharts(!showCharts)}
            >
              {showCharts ? 'Hide Visual Charts' : 'Show Visual Charts'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#240E0C] border border-[#451F1B] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#A8958B] tracking-wider block">Total Audited</span>
          <span className="text-xl font-bold font-mono text-white">{total}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#240E0C] border border-[#451F1B] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#34D399] tracking-wider block">Verified Real</span>
          <span className="text-xl font-bold font-mono text-[#34D399]">{realCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#240E0C] border border-[#451F1B] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#FB7185] tracking-wider block">Misleading Claims</span>
          <span className="text-xl font-bold font-mono text-[#FB7185]">{fakeCount}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#240E0C] border border-[#451F1B] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#E8D2A7] tracking-wider block">Mean Confidence</span>
          <span className="text-xl font-bold font-mono text-[#E8D2A7]">{avgConfidence}%</span>
        </div>
      </div>

      {/* Optional Charts Drawer */}
      {showCharts && items.length > 0 && (
        <div className="ui-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-[#68312B] bg-[#28110E]">
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider">History Class Proportion</span>
              <span className="text-[11px] text-[#A8958B]">Current Page</span>
            </div>
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={miniPieData} innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                    {miniPieData.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C0B0A', borderColor: '#451F1B', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white uppercase tracking-wider">Top Sector Frequencies</span>
              <span className="text-[11px] text-[#A8958B]">Current Page</span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryCounts} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" stroke="#A8958B" fontSize={10} />
                  <YAxis dataKey="name" type="category" stroke="#FAF8F5" fontSize={10} width={70} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C0B0A', borderColor: '#451F1B', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#BA4E42" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Interactive Search & Multi-Filter Card */}
      <div className="ui-card p-5 space-y-4">
        
        {/* Main Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#A8958B] absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history by keyword, headline, category, or model..."
              className="ui-input pl-10 text-xs h-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); fetchHistory(); }}
                className="absolute right-3 top-3 text-[#A8958B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Verdict Filter */}
            <select
              value={predictionFilter}
              onChange={(e) => {
                setPredictionFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by verdict"
              className="bg-[#180908] border border-[#451F1B] rounded-pill px-3.5 py-1.5 text-xs text-[#EDE3D8] focus:border-[#BA4E42] focus:outline-none h-10 cursor-pointer"
            >
              <option value="">All Verdicts</option>
              <option value="REAL">Real News Only</option>
              <option value="FAKE">Misleading Only</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by category"
              className="bg-[#180908] border border-[#451F1B] rounded-pill px-3.5 py-1.5 text-xs text-[#EDE3D8] focus:border-[#BA4E42] focus:outline-none h-10 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Sectors' : cat}
                </option>
              ))}
            </select>

            {/* Confidence Range Filter */}
            <select
              value={confidenceTier}
              onChange={(e) => setConfidenceTier(e.target.value)}
              aria-label="Filter by confidence score"
              className="bg-[#180908] border border-[#451F1B] rounded-pill px-3.5 py-1.5 text-xs text-[#EDE3D8] focus:border-[#BA4E42] focus:outline-none h-10 cursor-pointer"
            >
              <option value="All">All Confidence</option>
              <option value="high">High (&gt; 80%)</option>
              <option value="medium">Medium (60-80%)</option>
              <option value="low">Low (&lt; 60%)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort order"
              className="bg-[#180908] border border-[#451F1B] rounded-pill px-3.5 py-1.5 text-xs text-[#EDE3D8] focus:border-[#BA4E42] focus:outline-none h-10 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="conf_high">Highest Certainty</option>
              <option value="conf_low">Lowest Certainty</option>
            </select>

            <Button type="submit" size="sm">
              Search
            </Button>
          </div>
        </form>

        {/* Quick Search Keyword Tags & Reset Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#451F1B]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#A8958B] flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-[#E57365]" />
              <span>Quick tags:</span>
            </span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTag(tag)}
                className="px-2.5 py-0.5 rounded-full bg-[#180908] hover:bg-[#341613] border border-[#451F1B] text-[10px] font-medium text-[#D4C4B7] hover:text-white transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {(search || predictionFilter || categoryFilter !== 'All' || confidenceTier !== 'All') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-[#E57365] hover:text-[#FB7185] flex items-center space-x-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Table */}
      <div className="ui-card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} />
        ) : processedItems.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#A8958B] font-semibold border-b border-[#451F1B] bg-[#180908]">
                  <tr>
                    <th className="py-3 px-3.5">Date & Time</th>
                    <th className="py-3 px-3.5">Headline / Excerpt</th>
                    <th className="py-3 px-3.5">Sector</th>
                    <th className="py-3 px-3.5">ML Prediction</th>
                    <th className="py-3 px-3.5">Confidence</th>
                    <th className="py-3 px-3.5">Model</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3A1814]">
                  {processedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#28110E] transition-colors">
                      <td className="py-3.5 px-3.5 text-[#A8958B] whitespace-nowrap font-mono text-[11px]">
                        {item.created_at || 'Recent'}
                      </td>
                      <td className="py-3.5 px-3.5 max-w-sm font-medium text-[#FAF8F5] truncate">
                        {item.title || item.text_snippet}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <Badge variant="default" size="sm">{item.category || 'General'}</Badge>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <PredictionBadge label={item.raw_label} size="sm" />
                      </td>
                      <td className="py-3.5 px-3.5 font-mono text-[#E8D2A7] font-semibold">
                        {item.confidence_percentage || Math.round(item.confidence * 100)}%
                      </td>
                      <td className="py-3.5 px-3.5 text-[#A8958B] whitespace-nowrap">
                        {item.model}
                      </td>
                      <td className="py-3.5 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedItem(item)}
                          title="Inspect Prediction Details & Signals"
                          className="p-1.5 rounded-pill text-[#D4C4B7] hover:text-white hover:bg-[#341613] transition-colors cursor-pointer border border-transparent hover:border-[#451F1B]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-pill text-[#A8958B] hover:text-[#FB7185] hover:bg-[#A82824]/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="p-4 border-t border-[#451F1B] flex items-center justify-between text-xs text-[#A8958B]">
              <span>Showing {processedItems.length} of {total} records</span>
              
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-pill bg-[#180908] border border-[#451F1B] hover:bg-[#28110E] text-[#EDE3D8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-white">Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-pill bg-[#180908] border border-[#451F1B] hover:bg-[#28110E] text-[#EDE3D8] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="No matching history found"
            description="Try changing your search keywords or clear current filters to view all audited news."
            actionLabel="Reset Search Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>

      {/* Prediction Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#240E0C] border border-[#68312B] rounded-section p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between pb-3 border-b border-[#451F1B]">
              <div className="flex items-center space-x-2">
                <span className="text-[#E57365] font-bold">✳</span>
                <h3 className="font-bold text-white text-base">Prediction Details & Signal Audit</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-pill text-[#A8958B] hover:text-white hover:bg-[#341613] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-[#A8958B] uppercase font-bold tracking-wider block">Headline</span>
                <p className="text-sm font-bold text-white mt-1">{selectedItem.title || 'Untitled Article'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B]">
                  <span className="text-[10px] text-[#A8958B] uppercase block font-semibold">Model Classification</span>
                  <div className="mt-1.5">
                    <PredictionBadge label={selectedItem.raw_label} size="sm" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B]">
                  <span className="text-[10px] text-[#A8958B] uppercase block font-semibold">Calibrated Certainty</span>
                  <span className="font-mono text-base font-bold text-[#E8D2A7] mt-1 block">
                    {selectedItem.confidence_percentage || Math.round(selectedItem.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#A8958B] uppercase font-bold tracking-wider block">Full Article Excerpt</span>
                <div className="p-3.5 rounded-xl bg-[#180908] border border-[#451F1B] text-[#EDE3D8] leading-relaxed max-h-36 overflow-y-auto mt-1 text-xs">
                  {selectedItem.full_text || selectedItem.text_snippet || selectedItem.text}
                </div>
              </div>

              {selectedItem.important_signals && selectedItem.important_signals.length > 0 && (
                <div className="pt-2">
                  <ExplainabilitySignals signals={selectedItem.important_signals} />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#451F1B]">
              <Button variant="cream" size="sm" onClick={() => setSelectedItem(null)}>
                Close Audit View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#240E0C] border border-[#68312B] rounded-card p-5 space-y-4 shadow-luxury">
            <h3 className="font-bold text-white text-sm">Delete Prediction Record?</h3>
            <p className="text-xs text-[#A8958B] leading-relaxed">
              Are you sure you want to permanently remove this verification item from your history?
            </p>
            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirmId)}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
