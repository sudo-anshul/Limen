'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type ArtifactPreviewProps = {
  screenshotArtifactId: string | null;
  htmlArtifactId: string | null;
  title: string | null;
};

export function ArtifactPreview({
  screenshotArtifactId,
  htmlArtifactId,
  title,
}: ArtifactPreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="ds-card p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div>
            <div className="ds-card-label">Rendered Evidence</div>
            <h3 className="text-scale-15 font-bold text-[var(--color-text-primary)] truncate max-w-sm mt-0.5">
              {title ?? 'Screenshot Preview'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {screenshotArtifactId && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="ds-button-secondary text-scale-11 py-1 px-2.5 rounded-full"
                title="Expand screenshot"
              >
                🔍 Expand
              </button>
            )}
            {htmlArtifactId && (
              <a
                href={`/api/artifacts/${htmlArtifactId}`}
                target="_blank"
                rel="noreferrer"
                className="ds-button-secondary text-scale-11 py-1 px-2.5 rounded-full"
              >
                HTML Snapshot
              </a>
            )}
          </div>
        </div>

        {/* Browser Frame Preview */}
        <div className="rounded-[var(--radius-control)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-canvas)]">
          {/* Browser Topbar Header */}
          <div className="h-7 bg-[var(--color-border)]/50 px-3 flex items-center gap-1.5 border-b border-[var(--color-border)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block opacity-80" />
            <span className="text-scale-11 text-[var(--color-text-muted)] ml-2 truncate font-mono">
              {title || 'https://target-page.com'}
            </span>
          </div>

          {/* Screenshot display */}
          {screenshotArtifactId ? (
            <div
              className="relative aspect-[16/10] w-full cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={`/api/artifacts/${screenshotArtifactId}`}
                alt={title ?? 'Rendered screenshot'}
                fill
                unoptimized
                className="object-cover object-top transition duration-200 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="px-3 py-1 rounded-full bg-black/75 text-white text-scale-11 font-medium backdrop-blur-xs">
                  Click to Expand
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <span className="text-2xl mb-2">📸</span>
              <p className="text-scale-12 font-medium text-[var(--color-text-secondary)]">
                Screenshot capture in progress
              </p>
              <p className="text-scale-11 text-[var(--color-text-muted)] mt-1">
                Visual proof will render once the crawler stores the viewport.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && screenshotArtifactId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative max-w-5xl max-h-[90vh] w-full ds-card overflow-hidden bg-black p-2 flex flex-col">
            <div className="flex items-center justify-between p-3 text-white border-b border-white/15">
              <span className="text-scale-13 font-semibold truncate">{title ?? 'Screenshot Artifact'}</span>
              <div className="flex items-center gap-3">
                <a
                  href={`/api/artifacts/${screenshotArtifactId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-scale-11 underline text-white/80 hover:text-white"
                >
                  Open Original PNG
                </a>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="relative flex-1 overflow-auto max-h-[80vh] p-2 bg-neutral-950 flex items-center justify-center">
              <img
                src={`/api/artifacts/${screenshotArtifactId}`}
                alt={title ?? 'Full Screenshot'}
                className="max-w-full h-auto rounded object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
