export function formatChannel(channel: string) {
  return channel
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function verdictTone(verdict: string | null) {
  switch (verdict) {
    case 'ship':
      return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100';
    case 'caveat':
      return 'border-amber-500/30 bg-amber-500/15 text-amber-100';
    case 'block':
      return 'border-rose-500/30 bg-rose-500/15 text-rose-100';
    default:
      return 'border-white/10 bg-white/5 text-zinc-200';
  }
}

export function confidenceTone(confidence: string | null) {
  switch (confidence) {
    case 'high':
      return 'text-emerald-200';
    case 'medium':
      return 'text-amber-200';
    case 'low':
      return 'text-zinc-200';
    default:
      return 'text-zinc-300';
  }
}

export function findingCategoryLabel(category: string) {
  switch (category) {
    case 'launch_blocker':
      return 'Launch blocker';
    case 'trust_gap':
      return 'Trust gap';
    case 'message_alignment':
      return 'Message alignment';
    case 'cta_friction':
      return 'CTA friction';
    case 'channel_mismatch':
      return 'Channel mismatch';
    default:
      return category;
  }
}
