// ============================================================================
// DATA INGESTION - FETCH UTILITIES
// Shared utilities for rate-limited API fetching
// ============================================================================

import type { AdapterError, AdapterResponse, RateLimitConfig } from './types';

/**
 * Default rate limit configuration
 */
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  requestsPerSecond: 2,
  maxRetries: 3,
  retryDelayMs: 1000,
};

/**
 * Simple in-memory rate limiter
 * Tracks last request time per domain
 */
class RateLimiter {
  private lastRequestTime: Map<string, number> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = DEFAULT_RATE_LIMIT) {
    this.config = config;
  }

  /**
   * Wait until we can make a request to the given domain
   */
  async throttle(domain: string): Promise<void> {
    const now = Date.now();
    const lastRequest = this.lastRequestTime.get(domain) || 0;
    const minInterval = 1000 / this.config.requestsPerSecond;
    const timeSinceLast = now - lastRequest;

    if (timeSinceLast < minInterval) {
      const waitTime = minInterval - timeSinceLast;
      await sleep(waitTime);
    }

    this.lastRequestTime.set(domain, Date.now());
  }

  /**
   * Get retry delay for a given attempt number (exponential backoff)
   */
  getRetryDelay(attempt: number): number {
    return this.config.retryDelayMs * Math.pow(2, attempt);
  }

  get maxRetries(): number {
    return this.config.maxRetries;
  }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract domain from URL for rate limiting
 */
function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Create an adapter error from various error types
 */
function createAdapterError(
  error: unknown,
  statusCode?: number
): AdapterError {
  if (error instanceof Error) {
    // Check for rate limiting
    if (statusCode === 429) {
      return {
        code: 'RATE_LIMITED',
        message: 'Rate limit exceeded. Please slow down requests.',
        statusCode: 429,
        retryAfter: 60,
      };
    }

    // Check for not found
    if (statusCode === 404) {
      return {
        code: 'NOT_FOUND',
        message: 'Resource not found.',
        statusCode: 404,
      };
    }

    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        code: 'NETWORK_ERROR',
        message: `Network error: ${error.message}`,
        statusCode,
      };
    }

    // Parse errors
    if (error.message.includes('JSON') || error.message.includes('parse')) {
      return {
        code: 'PARSE_ERROR',
        message: `Failed to parse response: ${error.message}`,
        statusCode,
      };
    }

    return {
      code: 'UNKNOWN',
      message: error.message,
      statusCode,
    };
  }

  return {
    code: 'UNKNOWN',
    message: String(error),
    statusCode,
  };
}

/**
 * Rate-limited fetch wrapper with retry logic
 */
export async function rateLimitedFetch<T>(
  url: string,
  options: {
    headers?: Record<string, string>;
    rateLimiter?: RateLimiter;
    source?: string;
  } = {}
): Promise<AdapterResponse<T>> {
  const { 
    headers = {}, 
    rateLimiter = defaultRateLimiter,
    source = 'unknown' 
  } = options;
  
  const domain = getDomain(url);
  let lastError: AdapterError | null = null;

  for (let attempt = 0; attempt <= rateLimiter.maxRetries; attempt++) {
    try {
      // Throttle requests
      await rateLimiter.throttle(domain);

      // Make the request
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TheCardSeeker/1.0',
          ...headers,
        },
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        lastError = {
          code: 'RATE_LIMITED',
          message: 'Rate limit exceeded',
          statusCode: 429,
          retryAfter,
        };

        if (attempt < rateLimiter.maxRetries) {
          await sleep(retryAfter * 1000);
          continue;
        }

        return { data: null, error: lastError, source };
      }

      // Handle not found
      if (response.status === 404) {
        return {
          data: null,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found',
            statusCode: 404,
          },
          source,
        };
      }

      // Handle other errors
      if (!response.ok) {
        lastError = {
          code: 'UNKNOWN',
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };

        if (attempt < rateLimiter.maxRetries) {
          await sleep(rateLimiter.getRetryDelay(attempt));
          continue;
        }

        return { data: null, error: lastError, source };
      }

      // Parse response
      const data = await response.json() as T;

      return {
        data,
        error: null,
        source,
        cachedAt: new Date().toISOString(),
      };
    } catch (error) {
      lastError = createAdapterError(error);

      if (attempt < rateLimiter.maxRetries) {
        await sleep(rateLimiter.getRetryDelay(attempt));
        continue;
      }
    }
  }

  return {
    data: null,
    error: lastError || { code: 'UNKNOWN', message: 'Unknown error' },
    source,
  };
}

/**
 * Default rate limiter instance (shared)
 */
const defaultRateLimiter = new RateLimiter();

/**
 * Create a custom rate limiter
 */
export function createRateLimiter(config: Partial<RateLimitConfig>): RateLimiter {
  return new RateLimiter({ ...DEFAULT_RATE_LIMIT, ...config });
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(baseUrl);
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}
