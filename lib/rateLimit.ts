/**
 * Rate limiter for the chat endpoint.
 *
 * Two backends, chosen from the environment:
 *
 *   1. A shared Redis-over-HTTP store (Upstash Redis, or any service that
 *      speaks the same REST pipeline API). Set REDIS_REST_URL and
 *      REDIS_REST_TOKEN. This is the mode a public deployment should use:
 *      counters are shared across every serverless instance, so the limit is a
 *      real limit rather than a per-instance suggestion.
 *
 *   2. In-memory sliding window. Zero setup, but per-instance, so on serverless
 *      each instance keeps its own counters. Fine for local development and as
 *      a safety net, not a quota.
 *
 * The limiter fails open: if the shared store is unreachable, requests are
 * allowed and the failure is logged. Availability matters more here than
 * perfect abuse damping - being unable to reach someone in distress because a
 * counter could not be read would be the worst possible trade.
 */

const WINDOW_MS = 60_000;
const WINDOW_SECONDS = Math.ceil(WINDOW_MS / 1000);
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 20);

const STORE_URL = process.env.REDIS_REST_URL;
const STORE_TOKEN = process.env.REDIS_REST_TOKEN;

export const rateLimitStore: "shared-redis" | "memory" =
  STORE_URL && STORE_TOKEN ? "shared-redis" : "memory";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

function windowId(now: number): number {
  return Math.floor(now / WINDOW_MS);
}

/* --------------------------------------------------------------- memory mode */

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

function checkMemory(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);

  if (bucket.timestamps.length >= MAX_REQUESTS) {
    buckets.set(key, bucket);
    const oldest = bucket.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
    };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, remaining: MAX_REQUESTS - bucket.timestamps.length, retryAfterSeconds: 0 };
}

/* --------------------------------------------------------------- shared mode */

/**
 * Fixed-window counter. One INCR per request, an EXPIRE set only when the key
 * is created, and a TTL for the retry hint - three commands in one round trip.
 * A fixed window lets through up to 2x the limit across a boundary, which is
 * acceptable for abuse damping and much cheaper than a sorted set.
 */
async function checkShared(key: string): Promise<RateLimitResult> {
  const counterKey = `rl:${key}:${windowId(Date.now())}`;

  const response = await fetch(`${STORE_URL}/pipeline`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${STORE_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", counterKey],
      ["EXPIRE", counterKey, String(WINDOW_SECONDS), "NX"],
      ["TTL", counterKey],
    ]),
    signal: AbortSignal.timeout(2000),
  });

  if (!response.ok) throw new Error(`rate store responded ${response.status}`);

  const data = (await response.json()) as { result?: unknown }[];
  const count = Number(data?.[0]?.result ?? 1);
  const ttl = Number(data?.[2]?.result ?? 0);

  if (count > MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: ttl > 0 ? ttl : WINDOW_SECONDS,
    };
  }

  return { allowed: true, remaining: Math.max(0, MAX_REQUESTS - count), retryAfterSeconds: 0 };
}

/* -------------------------------------------------------------------- public */

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  if (rateLimitStore === "shared-redis") {
    try {
      return await checkShared(key);
    } catch (error) {
      console.error("[rate-limit] shared store unavailable, allowing the request", error);
    }
  }
  return checkMemory(key);
}

/**
 * Coarse client key. We deliberately do not fingerprint beyond what is needed
 * to stop a loop, and we never store message content alongside it.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  return `chat:${ip}`;
}
