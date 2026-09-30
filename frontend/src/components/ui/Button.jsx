import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-input transition-colors duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs h-8 gap-1.5",
    md: "px-4 py-2 text-sm h-10 gap-2",
    lg: "px-5 py-2.5 text-sm h-11 gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-subtle",
    secondary: "bg-[#172033] hover:bg-[#202b42] text-slate-200 border border-[#263244] shadow-subtle",
    ghost: "bg-transparent hover:bg-[#172033] text-slate-300 hover:text-white",
    danger: "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-subtle",
    outlineDanger: "bg-transparent hover:bg-rose-950/30 text-rose-400 border border-rose-800/60",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
