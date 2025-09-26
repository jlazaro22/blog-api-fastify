import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import fastify, { FastifyInstance } from 'fastify';

import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyHelmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import { corsOptions } from './lib/cors.js';
import { customErrorHandler, serverOptions } from './lib/fastify.js';
import { jwtOptions } from './lib/jwt.js';
import { rateLimitOptions } from './lib/rate-limit.js';
import { v1Routes } from './routes/v1/index.js';

export const app: FastifyInstance = fastify(serverOptions);

// *** Plugins ***

app.register(fastifyCors, corsOptions);
app.register(fastifyFormbody);
app.register(fastifyJwt, jwtOptions);
app.register(fastifyCookie);
// only compress responses larger than 1KB
app.register(fastifyCompress, { global: true, threshold: 1024 });
app.register(fastifyHelmet);
await app.register(fastifyRateLimit, rateLimitOptions);

// *** Routes ***

app.register(v1Routes, { prefix: '/api/v1' });

// *** Error handling ***

customErrorHandler();
