'use client';

import React from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  subtitle?: string;
  segments: DonutSegment[];
  totalLabel?: string;
  className?: string;
}

export function DonutChart({
  title,
  subtitle,
  segments,
  totalLabel = 'Total issues',
  className = '',
}: DonutChartProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const size = 160;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 18;

  let accumulatedOffset = 0;

  return (
    <div className={`ds-card p-5 flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="ds-card-label">{title}</div>
          {subtitle && (
            <div className="text-scale-12 text-[var(--color-text-secondary)] mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
        <div className="text-scale-11 font-semibold px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text-secondary)]">
          {total} Total
        </div>
      </div>

      <div className="my-3 flex items-center justify-center relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Base background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[var(--color-border)] opacity-40"
          />

          {total > 0 &&
            segments.map((segment) => {
              if (segment.value === 0) return null;
              const sliceRatio = segment.value / total;
              const strokeDasharray = `${sliceRatio * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedOffset;
              accumulatedOffset += sliceRatio * circumference;

              return (
                <circle
                  key={segment.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="butt"
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-scale-20 font-bold text-[var(--color-text-primary)] leading-tight">
            {total}
          </span>
          <span className="text-scale-11 font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            {totalLabel}
          </span>
        </div>
      </div>

      {/* Legend below */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3 border-t border-[var(--color-border)] text-scale-12">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-[var(--color-text-secondary)]">{seg.label}</span>
            <span className="font-semibold text-[var(--color-text-primary)]">({seg.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
