'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const terminalStatuses = new Set(['completed', 'failed', 'partial_failed']);

export function LiveRunRefresh({ status }: { status: string }) {
  const router = useRouter();

  useEffect(() => {
    if (terminalStatuses.has(status)) {
      return;
    }

    const interval = window.setInterval(() => {
      router.refresh();
    }, 2500);

    return () => window.clearInterval(interval);
  }, [router, status]);

  return null;
}
