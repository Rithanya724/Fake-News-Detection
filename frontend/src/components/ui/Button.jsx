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
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-pill transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-tight";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs h-8 gap-1.5",
    md: "px-5 py-2 text-xs sm:text-sm h-10 gap-2 font-medium",
    lg: "px-6 py-2.5 text-sm h-11 gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary: "bg-[#843932] hover:bg-[#9E4238] active:bg-[#6E2F29] text-white border border-[#9E4238]/50 shadow-luxury hover:shadow-glow-terracotta",
    cream: "bg-[#FAF8F5] hover:bg-white active:bg-[#EDE3D8] text-[#1C0B0A] border border-[#D8CCC0] font-semibold shadow-subtle",
    secondary: "bg-[#28110E] hover:bg-[#341613] text-[#EDE3D8] border border-[#451F1B] hover:border-[#68312B] shadow-subtle",
    ghost: "bg-transparent hover:bg-[#28110E] text-[#C4AFA9] hover:text-[#FAF8F5]",
    danger: "bg-[#A82824] hover:bg-[#C0322D] active:bg-[#8F1E1B] text-white border border-[#C0322D]/40 shadow-subtle",
    outlineDanger: "bg-transparent hover:bg-[#A82824]/20 text-[#F43F5E] border border-[#A82824]/50",
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
