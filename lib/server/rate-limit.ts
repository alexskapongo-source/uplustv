import "server-only";

/* ============================================================
   LIMITATION DE DEBIT
   Fenetre glissante en memoire. Suffisant pour une instance
   unique ; a remplacer par un store partage (Redis) en cas de
   deploiement multi-instances.
   ============================================================ */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

/** Purge paresseuse pour eviter que la map ne croisse indefiniment. */
function sweep(now: number): void {
  if (buckets.size < 500) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { ok: true, retryAfterSeconds: 0 };
}

/** Identifie l'appelant a partir des en-tetes de proxy usuels. */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "inconnu";
  return `${scope}:${ip}`;
}
