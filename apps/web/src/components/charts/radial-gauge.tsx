'use client';

import React from 'react';

interface GaugeRing {
  label: string;
  value: number; // 0 to 100
  color: string;
}

interface ConcentricRadialGaugeProps {
  title: string;
  subtitle?: string;
  rings: GaugeRing[];
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export function ConcentricRadialGauge({
  title,
  subtitle,
  rings,
  centerLabel,
  centerValue,
  className = '',
}: ConcentricRadialGaugeProps) {
  const size = 180;
  const center = size / 2;
  const strokeWidth = 10;
  const gap = 6;

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
        <div className="flex items-center gap-1.5 text-scale-11 text-[var(--color-text-muted)]">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-positive)]" />
          <span>Live metrics</span>
        </div>
      </div>

      <div className="my-4 flex items-center justify-center relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {rings.map((ring, index) => {
            const radius = center - strokeWidth / 2 - index * (strokeWidth + gap);
            const circumference = 2 * Math.PI * radius;
            const progressOffset = circumference - (ring.value / 100) * circumference;

            return (
              <g key={ring.label}>
                {/* Background track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-slate-200/50 dark:text-neutral-800"
                />
                {/* Active progress ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </g>
            );
          })}
        </svg>

        {/* Center label */}
        {(centerValue || centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {centerValue && (
              <span className="text-scale-20 font-bold text-[var(--color-text-primary)] leading-tight">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="text-scale-11 font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                {centerLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Legend list below */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--color-border)]">
        {rings.map((ring) => (
          <div key={ring.label} className="flex items-center justify-between text-scale-12">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ring.color }} />
              <span className="text-[var(--color-text-secondary)] truncate">{ring.label}</span>
            </div>
            <span className="font-semibold text-[var(--color-text-primary)] ml-2">{ring.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
