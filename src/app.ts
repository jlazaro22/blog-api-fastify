import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import fastifyHelmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import fastify, { FastifyInstance } from 'fastify';

import { corsOptions } from 'lib/cors';
import { customErrorHandler, getLoggerOptions } from 'lib/fastify';
import { jwtOptions } from 'lib/jwt';
import { multipartOptions } from 'lib/multipart';
import { rateLimitOptions } from 'lib/rate-limit';
import { v1Routes } from 'routes/v1';

export const app: FastifyInstance = await fastify(getLoggerOptions());

// *** Plugins ***
await app.register(fastifyCors, corsOptions);
await app.register(fastifyFormbody);
await app.register(fastifyMultipart, multipartOptions);
await app.register(fastifyJwt, jwtOptions);
await app.register(fastifyCookie);
await app.register(fastifyCompress, { global: true, threshold: 1024 }); // only compress responses larger than 1KB
await app.register(fastifyHelmet);
await app.register(fastifyRateLimit, rateLimitOptions);

// *** Error handling ***
customErrorHandler();

// *** Routes ***
await app.register(v1Routes, { prefix: '/api/v1' });
