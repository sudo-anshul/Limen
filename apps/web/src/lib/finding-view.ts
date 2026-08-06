export function severityTone(severity: string) {
  switch (severity) {
    case 'critical':
      return 'border-rose-500/30 bg-rose-500/15 text-rose-100';
    case 'high':
      return 'border-orange-500/30 bg-orange-500/15 text-orange-100';
    case 'medium':
      return 'border-amber-500/30 bg-amber-500/15 text-amber-100';
    default:
      return 'border-white/10 bg-white/5 text-zinc-200';
  }
}
