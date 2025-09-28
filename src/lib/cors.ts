import { FastifyCorsOptions } from '@fastify/cors';

import { app } from '../app';
import config from '../config';
import { env } from '../env';

export const corsOptions: FastifyCorsOptions = {
  origin(origin, callback) {
    if (
      env.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: ${origin} is not allowed.`), false);
      app.log.warn(`CORS error: ${origin} is not allowed.`);
    }
  },
};
