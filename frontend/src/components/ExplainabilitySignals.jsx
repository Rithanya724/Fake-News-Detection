import React from 'react';
import { Info } from 'lucide-react';

export const ExplainabilitySignals = ({ signals }) => {
  if (!signals || signals.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[#180908] border border-[#451F1B] text-xs text-[#A8958B]">
        No significant statistical token weights extracted for this input.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[#EDE3D8] uppercase tracking-wider flex items-center gap-1.5">
          <span className="text-[#E57365]">✳</span>
          <span>Model Signal Tokens (TF-IDF Log-Odds Evidence)</span>
        </h4>
        <span className="text-[11px] text-[#A8958B] font-mono">Weight Impact</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {signals.map((sig, idx) => {
          const isCredible = sig.indicator === 'Credible Indicator' || sig.weight > 0;
          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#180908] border border-[#451F1B] flex items-center justify-between text-xs hover:border-[#68312B] transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <span className={`font-mono font-bold text-base ${isCredible ? 'text-[#34D399]' : 'text-[#FB7185]'}`}>
                  {isCredible ? '+' : '−'}
                </span>
                <div>
                  <span className="font-mono font-semibold text-[#FAF8F5]">{sig.feature}</span>
                  <span className="block text-[10px] text-[#A8958B]">
                    {isCredible ? 'Credible Indicator' : 'Misleading Indicator'}
                  </span>
                </div>
              </div>

              <span className={`font-mono text-xs font-bold ${isCredible ? 'text-[#34D399]' : 'text-[#FB7185]'}`}>
                {sig.weight > 0 ? `+${sig.weight.toFixed(4)}` : sig.weight.toFixed(4)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[#A8958B] leading-relaxed pt-1">
        These signals describe statistical patterns discovered in the training corpus and indicate tokens that influenced the logistic regression decision boundary.
      </p>
    </div>
  );
};
