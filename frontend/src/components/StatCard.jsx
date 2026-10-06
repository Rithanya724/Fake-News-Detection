import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, badge, accent = 'default' }) => {
  const accentIndicator = {
    default: 'border-l-2 border-[#68312B]',
    terracotta: 'border-l-2 border-[#E57365]',
    emerald: 'border-l-2 border-[#34D399]',
    rose: 'border-l-2 border-[#FB7185]',
    champagne: 'border-l-2 border-[#E8D2A7]',
    indigo: 'border-l-2 border-[#818CF8]',
    amber: 'border-l-2 border-[#FBBF24]',
  };

  return (
    <div className={`ui-card p-5 space-y-3 ${accentIndicator[accent] || accentIndicator.default}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#A8958B] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#180908] border border-[#451F1B] flex items-center justify-center text-[#D4C4B7]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">{value}</span>
        {badge && (
          <span className="text-[10px] font-medium text-[#D4C4B7] bg-[#180908] px-2 py-0.5 rounded-full border border-[#451F1B]">
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-[#A8958B] leading-normal">{subtitle}</p>}
    </div>
  );
};
