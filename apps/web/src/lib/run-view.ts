export function formatChannel(channel: string) {
  return channel
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function verdictTone(verdict: string | null) {
  switch (verdict) {
    case 'ship':
      return 'border-[var(--color-positive)]/30 bg-[var(--color-positive-bg)] text-[var(--color-positive)]';
    case 'caveat':
      return 'border-[var(--color-warning)]/40 bg-[var(--color-warning-bg)] text-[var(--color-warning)]';
    case 'block':
      return 'border-[var(--color-negative)]/30 bg-[var(--color-negative-bg)] text-[var(--color-negative)]';
    default:
      return 'border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-text-secondary)]';
  }
}

export function verdictAccentTone(verdict: string | null) {
  switch (verdict) {
    case 'ship':
      return 'from-[#5A9790]/15 via-[#5A9790]/5 to-transparent';
    case 'caveat':
      return 'from-[#D9B96A]/15 via-[#D9B96A]/5 to-transparent';
    case 'block':
      return 'from-[#C97A85]/15 via-[#C97A85]/5 to-transparent';
    default:
      return 'from-[var(--color-primary)]/10 via-transparent to-transparent';
  }
}

export function confidenceTone(confidence: string | null) {
  switch (confidence) {
    case 'high':
      return 'text-[var(--color-positive)]';
    case 'medium':
      return 'text-[var(--color-warning)]';
    case 'low':
      return 'text-[var(--color-negative)]';
    default:
      return 'text-[var(--color-text-secondary)]';
  }
}

export function confidenceLabel(confidence: string | null) {
  switch (confidence) {
    case 'high':
      return 'High Confidence';
    case 'medium':
      return 'Medium Confidence';
    case 'low':
      return 'Low Confidence';
    default:
      return 'Confidence Pending';
  }
}

export function verdictLabel(verdict: string | null) {
  switch (verdict) {
    case 'ship':
      return 'Ship';
    case 'caveat':
      return 'Caveat';
    case 'block':
      return 'Block';
    default:
      return 'Pending';
  }
}

export function findingCategoryLabel(category: string) {
  switch (category) {
    case 'launch_blocker':
      return 'Launch Blocker';
    case 'trust_gap':
      return 'Trust Gap';
    case 'message_alignment':
      return 'Message Alignment';
    case 'cta_friction':
      return 'CTA Friction';
    case 'channel_mismatch':
      return 'Channel Mismatch';
    default:
      return category
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
  }
}
