import type { RateLimitPluginOptions } from '@fastify/rate-limit';
import { env } from 'env';

export const rateLimitOptions: RateLimitPluginOptions = {
  max: env.NODE_ENV === 'development' ? 10 : env.RATE_LIMIT_MAX,
  timeWindow: '1 minute',
};
