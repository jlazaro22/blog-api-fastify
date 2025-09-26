import { FastifyCorsOptions } from '@fastify/cors';

import { app } from '../app.js';
import config from '../config/index.js';
import { env } from '../env/index.js';

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
