import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, badge, accent = 'default' }) => {
  const accentIndicator = {
    default: 'border-l-2 border-slate-600',
    emerald: 'border-l-2 border-emerald-500',
    rose: 'border-l-2 border-rose-500',
    indigo: 'border-l-2 border-indigo-500',
    amber: 'border-l-2 border-amber-500',
  };

  return (
    <div className={`ui-card p-5 space-y-3 ${accentIndicator[accent] || accentIndicator.default}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-[#172033] border border-[#263244] flex items-center justify-center text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">{value}</span>
        {badge && (
          <span className="text-[11px] font-medium text-slate-400 bg-[#172033] px-1.5 py-0.5 rounded border border-[#263244]">
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-400 leading-normal">{subtitle}</p>}
    </div>
  );
};
