import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trailColor?: string;
  textColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  color = '#10B981',      // brand.accent (Mint Teal)
  trailColor = '#E2E8F0', // slate-200 (clean light trail)
  textColor = '#0F172A',  // brand.dark (Deep Slate Navy)
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safePercentage = typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0;
  const offset = circumference - (Math.max(0, Math.min(safePercentage, 100)) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background Trail */}
        <circle
          stroke={trailColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated Progress Ring */}
        <circle
          className="transition-all duration-1000 ease-out"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Percentage Center Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span 
          className="text-2xl font-bold tracking-tight" 
          style={{ color: textColor }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  );
};
export default ProgressRing;
