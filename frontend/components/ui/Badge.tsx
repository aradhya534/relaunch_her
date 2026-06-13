import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'gold' | 'indigo' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'teal',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide';
  
  const variants = {
    teal: 'bg-brand-accent/15 text-brand-accent border border-brand-accent/30',
    gold: 'bg-brand-highlight/15 text-brand-highlight border border-brand-highlight/30',
    indigo: 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20',
    gray: 'bg-brand-bgLight/20 text-brand-dark/70 border border-brand-bgLight/40',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
export default Badge;
