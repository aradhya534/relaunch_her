import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'glass';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'light',
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded-2xl p-6 transition-all duration-300';
  
  const variants = {
    light: 'bg-white text-brand-dark shadow-sm border border-brand-bgLight/60',
    dark: 'bg-brand-cardDark text-brand-bgLight shadow-xl border border-brand-primary/20',
    glass: 'bg-brand-primary/20 backdrop-blur-md text-brand-bgLight border border-brand-bgLight/20',
  };

  const hoverStyle = hoverable 
    ? 'hover:translate-y-[-4px] hover:shadow-xl hover:border-brand-accent/40 cursor-pointer' 
    : '';

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default Card;
