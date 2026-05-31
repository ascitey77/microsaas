import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;

export function getRatelimit(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!ratelimit) {
    const redis = new Redis({ url, token });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "vitrinelab",
    });
  }
  return ratelimit;
}

export async function checkRateLimit(
  identifier: string
): Promise<{ success: boolean; remaining?: number }> {
  const limiter = getRatelimit();
  if (!limiter) return { success: true };
  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining };
}
