import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  FileText,
  ScanSearch
} from 'lucide-react';

const CATEGORIES = [
  'All', 'Cotton', 'Silk', 'Wool', 'Yarn', 'Fabrics', 'Garments',
  'Machinery', 'Subsidies', 'Policy', 'Prices', 'Sustainability', 'Labour', 'Technology', 'Exports'
];

export const HistoryPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [predictionFilter, setPredictionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
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
    e.preventDefault();
    setPage(1);
    fetchHistory();
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

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <PageHeader
        title="Prediction History"
        subtitle="Review previous analyses, confidence metrics, and model feature evidence."
      />

      {/* Filter Control Row */}
      <div className="ui-card p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, headline, or category..."
              className="ui-input pl-9 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={predictionFilter}
              onChange={(e) => {
                setPredictionFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by verdict"
              className="bg-[#111827] border border-[#263244] rounded-input px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none h-9"
            >
              <option value="">All Verdicts</option>
              <option value="REAL">Real Only</option>
              <option value="FAKE">Misleading Only</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by category"
              className="bg-[#111827] border border-[#263244] rounded-input px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none h-9"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <Button type="submit" size="sm">
              Filter
            </Button>
          </div>
        </form>
      </div>

      {/* Main Table */}
      <div className="ui-card overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} />
        ) : items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 font-medium border-b border-[#263244] bg-[#172033]/50">
                  <tr>
                    <th className="py-3 px-3.5">Date</th>
                    <th className="py-3 px-3.5">Headline / Excerpt</th>
                    <th className="py-3 px-3.5">Category</th>
                    <th className="py-3 px-3.5">Prediction</th>
                    <th className="py-3 px-3.5">Confidence</th>
                    <th className="py-3 px-3.5">Model</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263244]/60">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-[#172033]/40 transition-colors">
                      <td className="py-3.5 px-3.5 text-slate-400 whitespace-nowrap">
                        {item.created_at}
                      </td>
                      <td className="py-3.5 px-3.5 max-w-sm font-medium text-slate-200 truncate">
                        {item.title || item.text_snippet}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <Badge variant="default" size="sm">{item.category}</Badge>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <PredictionBadge label={item.raw_label} size="sm" />
                      </td>
                      <td className="py-3.5 px-3.5 font-mono text-slate-300 font-medium">
                        {item.confidence_percentage || Math.round(item.confidence * 100)}%
                      </td>
                      <td className="py-3.5 px-3.5 text-slate-400 whitespace-nowrap">
                        {item.model}
                      </td>
                      <td className="py-3.5 px-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedItem(item)}
                          title="View Details"
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#172033] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 border-t border-[#263244] flex items-center justify-between text-xs text-slate-400">
              <span>Showing {items.length} of {total} records</span>
              
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-md bg-[#172033] border border-[#263244] hover:bg-[#202b42] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium text-slate-200">Page {page} of {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-md bg-[#172033] border border-[#263244] hover:bg-[#202b42] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title="No prediction history found"
            description="Try adjusting your filters or analyze a new article."
            actionLabel="Analyze News"
            onAction={() => window.location.href = '/detect'}
          />
        )}
      </div>

      {/* Prediction Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#111827] border border-[#263244] rounded-section p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#263244]">
              <h3 className="font-semibold text-white text-base">Prediction Details</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Headline</span>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedItem.title || 'Untitled Article'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-input bg-[#172033] border border-[#263244]">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Model Prediction</span>
                  <div className="mt-1">
                    <PredictionBadge label={selectedItem.raw_label} size="sm" />
                  </div>
                </div>

                <div className="p-3 rounded-input bg-[#172033] border border-[#263244]">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Confidence</span>
                  <span className="font-mono text-sm font-bold text-slate-200 mt-1 block">
                    {selectedItem.confidence_percentage || Math.round(selectedItem.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold block">Full Article Text</span>
                <div className="p-3 rounded-input bg-[#0B1120] border border-[#263244] text-slate-300 leading-relaxed max-h-36 overflow-y-auto mt-1">
                  {selectedItem.full_text || selectedItem.text_snippet}
                </div>
              </div>

              {selectedItem.important_signals && selectedItem.important_signals.length > 0 && (
                <div className="pt-2">
                  <ExplainabilitySignals signals={selectedItem.important_signals} />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#263244]">
              <Button variant="secondary" size="sm" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#111827] border border-[#263244] rounded-section p-5 space-y-4 shadow-xl">
            <h3 className="font-semibold text-white text-sm">Delete Record?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove this prediction from your history?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirmId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
