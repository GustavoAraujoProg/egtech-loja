'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusPoller({
  orderId,
  statusAtual,
}: {
  orderId: string;
  statusAtual: string;
}) {
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Só faz sentido continuar checando enquanto o pedido está pendente.
    if (statusAtual !== 'PENDING') return;

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status && data.status !== 'PENDING') {
          router.refresh();
        }
      } catch {
        // tenta de novo no próximo ciclo
      }
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [orderId, statusAtual, router]);

  return null;
}
