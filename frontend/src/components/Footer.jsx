import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#263244] bg-[#0B1120] text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-4">
        
        <div className="p-3.5 rounded-card bg-[#111827] border border-[#263244] text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Research Notice:</strong> Predictions represent statistical patterns learned from the training corpus and should not be treated as definitive factual verification.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>TEX-FACTS — Textile Industry Fake News Detection System © 2026</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="/about" className="hover:text-slate-300 transition-colors">Methodology</a>
            <a href="/analytics" className="hover:text-slate-300 transition-colors">Model Metrics</a>
            <a href="/api/v1/health" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors">API Status</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
