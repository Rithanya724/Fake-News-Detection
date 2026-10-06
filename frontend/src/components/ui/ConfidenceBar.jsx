import React from 'react';

export const ConfidenceBar = ({ percentage, label = "Model Confidence", isFake = false }) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const barColor = isFake ? 'bg-gradient-to-r from-[#BA4E42] to-[#E57365]' : 'bg-gradient-to-r from-[#059669] to-[#34D399]';

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#A8958B] font-medium">{label}</span>
        <span className="font-mono font-semibold text-[#EDE3D8]">{clamped.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-[#180908] h-2 rounded-full overflow-hidden border border-[#451F1B]">
        <div
          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
