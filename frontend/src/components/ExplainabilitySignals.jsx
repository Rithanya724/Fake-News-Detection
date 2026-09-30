import React from 'react';
import { Info } from 'lucide-react';

export const ExplainabilitySignals = ({ signals }) => {
  if (!signals || signals.length === 0) {
    return (
      <div className="p-4 rounded-card bg-[#111827] border border-[#263244] text-xs text-slate-400">
        No significant statistical token weights extracted for this input.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Model Signals (Feature Evidence)
        </h4>
        <span className="text-[11px] text-slate-500 font-mono">TF-IDF Log-Odds</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {signals.map((sig, idx) => {
          const isCredible = sig.indicator === 'Credible Indicator';
          return (
            <div
              key={idx}
              className="p-2.5 rounded-input bg-[#111827] border border-[#263244] flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2">
                <span className={`font-mono font-bold text-sm ${isCredible ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isCredible ? '+' : '−'}
                </span>
                <div>
                  <span className="font-mono font-medium text-slate-200">{sig.feature}</span>
                  <span className="block text-[10px] text-slate-400">
                    {isCredible ? 'Credible Signal' : 'Misleading Signal'}
                  </span>
                </div>
              </div>

              <span className="font-mono text-[11px] text-slate-400">
                {sig.weight > 0 ? `+${sig.weight.toFixed(4)}` : sig.weight.toFixed(4)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
        These signals describe statistical patterns used by the model. They do not independently verify the factual accuracy of the article.
      </p>
    </div>
  );
};
