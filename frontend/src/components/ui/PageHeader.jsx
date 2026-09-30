import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#263244] ${className}`}>
      <div className="space-y-1">
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
