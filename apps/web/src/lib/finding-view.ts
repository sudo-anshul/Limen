export function severityTone(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'border-[var(--color-negative)]/30 bg-[var(--color-negative-bg)] text-[var(--color-negative)]';
    case 'high':
      return 'border-[var(--color-warning)]/40 bg-[var(--color-warning-bg)] text-[var(--color-warning)]';
    case 'medium':
      return 'border-[var(--color-primary)]/30 bg-[var(--color-primary-badge)] text-[var(--color-primary)]';
    case 'low':
    default:
      return 'border-[var(--color-border)] bg-[var(--color-canvas)] text-[var(--color-text-secondary)]';
  }
}
