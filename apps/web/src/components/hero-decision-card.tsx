'use client';

import React from 'react';
import Link from 'next/link';

interface HeroDecisionCardProps {
  title: string;
  verdict?: string | null;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  badgeText?: string;
  metrics?: Array<{ label: string; value: string }>;
  variant?: 'blue' | 'teal';
  className?: string;
}

export function HeroDecisionCard({
  title,
  verdict,
  description,
  ctaText = 'New Launch Check',
  ctaHref = '/runs/new',
  onCtaClick,
  badgeText,
  metrics,
  variant = 'blue',
  className = '',
}: HeroDecisionCardProps) {
  const gradientClass = variant === 'teal' ? 'ds-hero-card-teal' : 'ds-hero-card';

  return (
    <div className={`${gradientClass} p-6 sm:p-7 shadow-sm ${className}`}>
      {/* Decorative background subtle vector overlay */}
      <svg
        className="absolute right-0 bottom-0 top-0 h-full w-2/3 pointer-events-none opacity-15 overflow-visible"
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="280" cy="120" r="140" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="280" cy="120" r="90" stroke="white" strokeWidth="1" />
        <circle cx="280" cy="120" r="40" fill="white" fillOpacity="0.08" />
        <path d="M120 180 Q200 40 380 120" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M160 210 Q240 80 400 160" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
      </svg>

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[190px]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {badgeText && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-scale-11 font-medium bg-white/20 text-white backdrop-blur-xs">
                {badgeText}
              </span>
            )}
            {verdict && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-scale-11 font-semibold bg-white text-[var(--accent-blue)]">
                Verdict: {verdict.toUpperCase()}
              </span>
            )}
          </div>

          <h2 className="text-scale-20 sm:text-scale-28 font-bold text-white tracking-tight leading-tight max-w-xl">
            {title}
          </h2>

          <p className="mt-2 text-scale-14 text-white/90 max-w-xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/15">
          {metrics && metrics.length > 0 ? (
            <div className="flex flex-wrap items-center gap-6 text-white">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-scale-11 uppercase font-semibold text-white/80 tracking-wider">
                    {m.label}
                  </div>
                  <div className="text-scale-18 font-bold text-white mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-scale-13 text-white/80">
              Ready for immediate launch validation
            </div>
          )}

          {ctaHref ? (
            <Link href={ctaHref} className="ds-hero-pill-btn">
              <span>{ctaText}</span>
              <span className="ml-1 text-scale-11">→</span>
            </Link>
          ) : (
            <button onClick={onCtaClick} className="ds-hero-pill-btn">
              <span>{ctaText}</span>
              <span className="ml-1 text-scale-11">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
