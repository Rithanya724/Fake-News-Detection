import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#451F1B] ${className}`}>
      <div className="space-y-1.5">
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="text-[#E57365] text-lg">✳</span>
          <span>{title}</span>
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#A8958B] max-w-3xl leading-relaxed">
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
