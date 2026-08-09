'use client';

import React, { useState } from 'react';

interface SplineTrendChartProps {
  title: string;
  subtitle?: string;
  metricValue?: string;
  metricDelta?: string;
  series1Name?: string;
  series2Name?: string;
  className?: string;
}

export function SplineTrendChart({
  title,
  subtitle,
  metricValue = '94.2%',
  metricDelta = '+3.5%',
  series1Name = 'Decision Confidence',
  series2Name = 'Signal Coverage',
  className = '',
}: SplineTrendChartProps) {
  const [range, setRange] = useState<'fast' | 'deep' | 'full'>('deep');

  // Spline path calculations for SVG
  const path1 = "M 0,75 C 20,60 35,65 50,45 C 65,25 80,30 100,15";
  const area1 = "M 0,75 C 20,60 35,65 50,45 C 65,25 80,30 100,15 L 100,100 L 0,100 Z";

  const path2 = "M 0,85 C 25,80 40,55 60,60 C 75,65 85,40 100,32";
  const area2 = "M 0,85 C 25,80 40,55 60,60 C 75,65 85,40 100,32 L 100,100 L 0,100 Z";

  return (
    <div className={`ds-card p-5 flex flex-col justify-between ${className}`}>
      {/* Header Row with Segmented Pill Group */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="ds-card-label">{title}</div>
          {subtitle && (
            <div className="text-scale-12 text-[var(--color-text-secondary)] mt-0.5">
              {subtitle}
            </div>
          )}
        </div>

        {/* Dark segmented control with light active pill */}
        <div className="ds-segmented-control self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setRange('fast')}
            className={`ds-segmented-btn ${range === 'fast' ? 'active' : ''}`}
          >
            Fast
          </button>
          <button
            type="button"
            onClick={() => setRange('deep')}
            className={`ds-segmented-btn ${range === 'deep' ? 'active' : ''}`}
          >
            Deep
          </button>
          <button
            type="button"
            onClick={() => setRange('full')}
            className={`ds-segmented-btn ${range === 'full' ? 'active' : ''}`}
          >
            Full
          </button>
        </div>
      </div>

      {/* Main Metric Callout */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-scale-28 font-bold text-[var(--color-text-primary)]">
          {metricValue}
        </span>
        <span className="ds-trend-pos">
          ▲ {metricDelta}
        </span>
        <span className="text-scale-11 text-[var(--color-text-muted)]">
          vs initial scan
        </span>
      </div>

      {/* Smooth Spline Chart */}
      <div className="relative h-40 w-full my-2">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="splineGradient1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6486AC" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#6486AC" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="splineGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#766E8E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#766E8E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeDasharray="3 3" className="text-[var(--color-border)] opacity-60" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeDasharray="3 3" className="text-[var(--color-border)] opacity-60" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeDasharray="3 3" className="text-[var(--color-border)] opacity-60" strokeWidth="0.5" />

          {/* Area fills */}
          <path d={area1} fill="url(#splineGradient1)" />
          <path d={area2} fill="url(#splineGradient2)" />

          {/* Spline lines */}
          <path d={path2} fill="none" stroke="#766E8E" strokeWidth="2.2" strokeLinecap="round" />
          <path d={path1} fill="none" stroke="#6486AC" strokeWidth="2.6" strokeLinecap="round" />

          {/* Endpoint markers */}
          <circle cx="100" cy="15" r="2.5" fill="#6486AC" />
          <circle cx="100" cy="32" r="2.5" fill="#766E8E" />
        </svg>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-scale-11 text-[var(--color-text-muted)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6486AC]" />
            <span className="text-[var(--color-text-secondary)] font-medium">{series1Name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#766E8E]" />
            <span className="text-[var(--color-text-secondary)] font-medium">{series2Name}</span>
          </div>
        </div>
        <span>Evidence-indexed</span>
      </div>
    </div>
  );
}
