import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no records matching your current filter criteria.",
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-12 text-center flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-[#172033] border border-[#263244] flex items-center justify-center text-slate-400 mb-1">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
