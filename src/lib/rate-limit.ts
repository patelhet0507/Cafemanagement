// Simple in-memory rate limiter (edge-safe for single instance; for multi-instance use Redis/KV)
type Entry = { count: number; reset: number };
const store = new Map<string, Entry>();

export function rateLimit(key: string, limit = 30, windowMs = 60_000): { ok: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const e = store.get(key);
  if (!e || now > e.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (e.count >= limit) return { ok: false, remaining: 0, reset: e.reset };
  e.count += 1;
  return { ok: true, remaining: limit - e.count, reset: e.reset };
}

// client helper for place order / login throttling
const clientHits = new Map<string, number[]>();
export function clientRateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (clientHits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) return false;
  arr.push(now);
  clientHits.set(key, arr);
  return true;
}
