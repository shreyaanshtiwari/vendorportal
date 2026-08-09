import React from 'react';
import '../../styles/dashboard.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export function Skeleton({ width, height, borderRadius = '8px', style, className }: SkeletonProps) {
  return (
    <div
      className={`skeleton-loader ${className || ''}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius,
        ...style
      }}
    />
  );
}
