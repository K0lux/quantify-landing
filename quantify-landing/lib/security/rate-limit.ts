type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

type RateLimitGlobal = typeof globalThis & {
  __quantifyRateLimitStore?: Map<string, RateLimitEntry>
}

const runtime = globalThis as RateLimitGlobal
// Best-effort burst control per runtime instance; use the host's shared WAF for distributed limits.
const store = runtime.__quantifyRateLimitStore ??= new Map<string, RateLimitEntry>()
const MAX_RATE_LIMIT_KEYS = 5_000

export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp && realIp.length <= 64) return realIp

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (forwardedFor && forwardedFor.length <= 64) return forwardedFor

  return 'unknown'
}

export function consumeRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): RateLimitResult {
  const current = store.get(key)
  if (current && current.resetAt > now) {
    if (current.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
      }
    }

    current.count += 1
    return {
      allowed: true,
      remaining: Math.max(0, limit - current.count),
      retryAfterSeconds: 0,
    }
  }

  if (current) store.delete(key)
  if (store.size >= MAX_RATE_LIMIT_KEYS) {
    for (const [storedKey, entry] of store) {
      if (entry.resetAt <= now) store.delete(storedKey)
      if (store.size < MAX_RATE_LIMIT_KEYS) break
    }
  }

  if (store.size >= MAX_RATE_LIMIT_KEYS) {
    const oldestKey = store.keys().next().value
    if (oldestKey) store.delete(oldestKey)
  }

  store.set(key, { count: 1, resetAt: now + windowMs })
  return { allowed: true, remaining: Math.max(0, limit - 1), retryAfterSeconds: 0 }
}
