import React from 'react';

export const ConfidenceBar = ({ percentage, label = "Model Confidence", isFake = false }) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const barColor = isFake ? 'bg-rose-500' : 'bg-emerald-500';

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="font-mono font-semibold text-slate-200">{clamped.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-[#172033] h-2 rounded-full overflow-hidden border border-[#263244]">
        <div
          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
