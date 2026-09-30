import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, User } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseStyles = "inline-flex items-center font-medium tracking-wide rounded-md border shrink-0";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variantStyles = {
    default: "bg-[#172033] text-slate-300 border-[#263244]",
    emerald: "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
    rose: "bg-rose-950/40 text-rose-400 border-rose-500/30",
    amber: "bg-amber-950/40 text-amber-400 border-amber-500/30",
    indigo: "bg-indigo-950/40 text-indigo-400 border-indigo-500/30",
    cyan: "bg-cyan-950/40 text-cyan-400 border-cyan-500/30",
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const PredictionBadge = ({ label, size = 'md' }) => {
  const isReal = label === 'REAL';
  return (
    <Badge variant={isReal ? 'emerald' : 'rose'} size={size}>
      {isReal ? (
        <>
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>REAL</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>POTENTIALLY MISLEADING</span>
        </>
      )}
    </Badge>
  );
};
