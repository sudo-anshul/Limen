'use client';

import React from 'react';
import Link from 'next/link';

interface AppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSwitcherModal({ isOpen, onClose }: AppSwitcherModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Mega-menu Panel */}
      <div className="relative z-10 w-full max-w-4xl ds-card shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <div>
            <span className="ds-card-label">App Switcher & Quick Launch</span>
            <h3 className="text-scale-15 font-bold text-[var(--color-text-primary)] mt-1">
              Limen Workspace Hub
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition"
          >
            ✕
          </button>
        </div>

        {/* 3-Column Categorized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {/* Column 1: Dashboards */}
          <div className="space-y-3">
            <div className="text-scale-11 uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
              Launch Dashboards
            </div>
            <ul className="space-y-1 text-scale-13">
              <li>
                <Link
                  href="/runs/new"
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2 rounded-[var(--radius-control)] hover:bg-[var(--color-primary-soft)] text-[var(--color-text-primary)] transition"
                >
                  <span className="ds-icon-badge ds-icon-badge-blue w-6 h-6 text-xs">🚀</span>
                  <span className="font-medium">New Launch Preflight</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2 rounded-[var(--radius-control)] hover:bg-[var(--color-primary-soft)] text-[var(--color-text-primary)] transition"
                >
                  <span className="ds-icon-badge ds-icon-badge-teal w-6 h-6 text-xs">📊</span>
                  <span>Decision Desk Overview</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center justify-between p-2 rounded-[var(--radius-control)] text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas)] transition">
                  <span className="flex items-center gap-2.5">
                    <span className="ds-icon-badge ds-icon-badge-purple w-6 h-6 text-xs">🎯</span>
                    <span>Persona Simulations</span>
                  </span>
                  <span className="text-scale-11 text-[var(--color-text-muted)]">Active</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 2: Channel Presets */}
          <div className="space-y-3">
            <div className="text-scale-11 uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
              Traffic Channels
            </div>
            <div className="flex flex-wrap gap-2">
              {['Cold Paid Ads', 'Branded Search', 'Founder Social', 'Product Hunt', 'Newsletter', 'Partner Referral'].map((chip) => (
                <Link
                  key={chip}
                  href={`/runs/new?channel=${encodeURIComponent(chip)}`}
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-full text-scale-12 font-medium bg-[var(--color-canvas)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition text-[var(--color-text-secondary)]"
                >
                  {chip}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Launch Preset Promo / Upsell Card */}
          <div className="ds-card p-4 bg-[var(--color-canvas)] border border-[var(--color-border-strong)] flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full text-scale-11 font-semibold bg-[var(--color-primary-badge)] text-[var(--color-primary)]">
                Preflight Pro
              </span>
              <h4 className="text-scale-13 font-bold text-[var(--color-text-primary)] mt-2">
                Automate Launch Signoffs
              </h4>
              <p className="text-scale-12 text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                Connect your staging webhooks to automatically block risky landing page releases.
              </p>
            </div>

            <Link
              href="/runs/new"
              onClick={onClose}
              className="mt-4 ds-button-primary text-center w-full"
            >
              Start Instant Run
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-scale-11 text-[var(--color-text-muted)]">
          <span>Press ESC to dismiss</span>
          <span>Limen Preflight v0.1</span>
        </div>
      </div>
    </div>
  );
}
