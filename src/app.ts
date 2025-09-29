import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import fastifyHelmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import fastify, { FastifyInstance } from 'fastify';

import { corsOptions } from 'lib/cors';
import { customErrorHandler, getLoggerOptions } from 'lib/fastify';
import { jwtOptions } from 'lib/jwt';
import { rateLimitOptions } from 'lib/rate-limit';
import { v1Routes } from 'routes/v1';

export const app: FastifyInstance = await fastify(getLoggerOptions());

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
