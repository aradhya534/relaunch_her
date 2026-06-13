import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]';
  
  const variants = {
    primary: 'bg-brand-accent text-brand-dark hover:opacity-90 hover:scale-[1.01] shadow-lg shadow-brand-accent/20',
    secondary: 'bg-brand-primary text-brand-bgLight hover:bg-opacity-90 hover:scale-[1.01]',
    outline: 'border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark hover:scale-[1.01] bg-transparent',
    ghost: 'text-brand-bgLight hover:bg-brand-cardDark hover:text-brand-accent',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
