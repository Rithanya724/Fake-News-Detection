import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseStyles = "inline-flex items-center font-medium tracking-wider uppercase rounded-pill border shrink-0";

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-[11px] gap-1.5",
  };

  const variantStyles = {
    default: "bg-[#28110E] text-[#D4C4B7] border-[#451F1B]",
    cream: "bg-[#FAF8F5] text-[#1C0B0A] border-[#D8CCC0] font-semibold",
    terracotta: "bg-[#843932]/25 text-[#E57365] border-[#843932]/50",
    champagne: "bg-[#C59B5D]/20 text-[#E8D2A7] border-[#C59B5D]/40",
    emerald: "bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30",
    rose: "bg-[#F43F5E]/15 text-[#FB7185] border-[#F43F5E]/30",
    amber: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30",
    indigo: "bg-[#6366F1]/15 text-[#818CF8] border-[#6366F1]/30",
    cyan: "bg-[#06B6D4]/15 text-[#22D3EE] border-[#06B6D4]/30",
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
          <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
          <span>REAL</span>
        </>
      ) : (
        <>
          <AlertTriangle className="w-3 h-3 text-[#FB7185]" />
          <span>POTENTIALLY MISLEADING</span>
        </>
      )}
    </Badge>
  );
};
