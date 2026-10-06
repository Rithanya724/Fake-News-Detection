import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#451F1B] bg-[#140605] text-[#A8958B] text-xs py-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-4">
        
        <div className="p-4 rounded-card bg-[#200D0B] border border-[#451F1B] text-[11px] text-[#C4AFA9] leading-relaxed flex items-start gap-2.5">
          <span className="text-[#E57365] text-sm leading-none shrink-0 font-bold">✳</span>
          <p>
            <strong className="text-[#FAF8F5]">Research Notice:</strong> TEX-FACTS classifications represent statistical machine-learning patterns learned from natural language corpus benchmarks and are intended for analytical decision support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#8A746E] text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#E57365]">✳</span>
            <span>TEX-FACTS — Textile Misinformation Detection & Intelligence © 2026</span>
          </div>

          <div className="flex items-center space-x-5">
            <a href="/about" className="hover:text-[#EDE3D8] transition-colors">Methodology</a>
            <a href="/analytics" className="hover:text-[#EDE3D8] transition-colors">Model Metrics</a>
            <a href="/detect" className="hover:text-[#EDE3D8] transition-colors">Analyzer</a>
            <a href="/history" className="hover:text-[#EDE3D8] transition-colors">Audit History</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
