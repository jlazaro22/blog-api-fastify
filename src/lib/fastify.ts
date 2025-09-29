import { FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify';
import { ZodError } from 'zod';

import { env } from 'env';
import { app } from 'app';
import { rateLimitOptions } from './rate-limit';

export function getLoggerOptions() {
  let serverOptions: FastifyServerOptions = {};

  if (process.stdout.isTTY) {
    serverOptions = {
      logger: {
        enabled: env.NODE_ENV === 'development',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'dd-mm-yyyy HH:MM:ss',
            colorize: true,
            ignore: 'pid,hostname',
          },
        },
      },
    };
  } else {
    serverOptions = { logger: { level: env.LOG_LEVEL ?? 'silent' } };
  }

  return serverOptions;
}

export async function customErrorHandler() {
  app.setErrorHandler((err, request, reply) => {
    if (err instanceof ZodError) {
      return reply.code(400).send({ message: 'Validation error', issues: err });
    }

    if (err.statusCode === 429) {
      err.message =
        'You have sent too many requests in a short period, please try again later.';

      return reply.code(429).send(err);
    }

    app.log.error(
      {
        err,
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      'Unhandled error occurred',
    );

    let message = 'Internal Server Error';
    if (err.statusCode && err.statusCode < 500) {
      message = err.message;
    }

    if (env.NODE_ENV !== 'production') {
      app.log.error(err);
    } else {
      // send error to external tool DataDog/New Relic/Sentry
    }

    return reply.code(err.statusCode ?? 500).send({ message: message });
  });

  // An attacker could search for valid URLs if the 404 error handling is not rate limited.
  app.setNotFoundHandler(
    { preHandler: app.rateLimit(rateLimitOptions) },
    (request: FastifyRequest, reply: FastifyReply) => {
      request.log.warn(
        {
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        'Resource not found',
      );

      return reply.code(404).send({ message: 'Not Found' });
    },
  );
}
