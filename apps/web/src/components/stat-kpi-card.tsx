'use client';

import React from 'react';

export type AccentColor = 'blue' | 'teal' | 'purple' | 'rose' | 'amber';

interface StatKpiCardProps {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  caption?: string;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  accent?: AccentColor;
  className?: string;
}

export function StatKpiCard({
  icon,
  value,
  label,
  caption,
  trend,
  accent = 'blue',
  className = '',
}: StatKpiCardProps) {
  const accentBarClass = {
    blue: 'ds-accent-bar-blue',
    teal: 'ds-accent-bar-teal',
    purple: 'ds-accent-bar-purple',
    rose: 'ds-accent-bar-rose',
    amber: 'ds-accent-bar-amber',
  }[accent];

  const iconBadgeClass = {
    blue: 'ds-icon-badge-blue',
    teal: 'ds-icon-badge-teal',
    purple: 'ds-icon-badge-purple',
    rose: 'ds-icon-badge-rose',
    amber: 'ds-icon-badge-amber',
  }[accent];

  return (
    <div className={`ds-card ds-card-hover p-4 pb-5 flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`ds-icon-badge ${iconBadgeClass}`}>
            {icon}
          </div>
          {trend && (
            <span
              className={
                trend.neutral
                  ? 'text-scale-11 font-medium text-[var(--color-text-muted)]'
                  : trend.positive
                  ? 'ds-trend-pos'
                  : 'ds-trend-neg'
              }
            >
              {trend.positive ? '▲' : trend.neutral ? '●' : '▼'} {trend.value}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-scale-28 font-bold tracking-tight text-[var(--color-text-primary)]">
            {value}
          </div>
        </div>

        <div className="ds-card-label mt-1">
          {label}
        </div>
      </div>

      {caption && (
        <div className="text-scale-11 text-[var(--color-text-muted)] mt-2 pt-2 border-t border-[var(--color-border-subtle)] truncate">
          {caption}
        </div>
      )}

      {/* 2-3px accent-colored bar along the bottom edge */}
      <div className={`ds-accent-bar ${accentBarClass}`} />
    </div>
  );
}
