import { FastifyMultipartOptions } from '@fastify/multipart';
import DOMPurify from 'dompurify';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JSDOM } from 'jsdom';

import { app } from 'app';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const multipartOptions: FastifyMultipartOptions = {
  limits: {
    // fieldNameSize: 100, // Max field name size in bytes
    // fieldSize: 100, // Max field value size in bytes
    // fields: 10, // Max number of non-file fields
    files: 1, // Max number of file fields
    fileSize: 2 * 1024 * 1024, // 2 MB // For multipart forms, the max file size in bytes
    // headerPairs: 2000, // Max number of header key=>value pairs
    // parts: 1000,
  },
};

export async function parseMultipart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const parts = request.parts();
  const fields: { [key: string]: any } = {};
  let fileBuffer: Buffer<ArrayBufferLike> | undefined;

  try {
    for await (const part of parts) {
      if (part.type === 'file') {
        fileBuffer = await part.toBuffer();
      } else {
        if (part.fieldname === 'content') {
          fields[part.fieldname] = purify.sanitize(part.value as string | Node);
          continue;
        }

        fields[part.fieldname] = part.value;
      }
    }

    if (!fileBuffer) {
      return reply.code(400).send({
        code: 'ValidationError',
        message: 'Blog banner image is required.',
      });
    }

    return { fields, fileBuffer };
  } catch (err) {
    app.log.error(err, 'Error parsing the multipart request.');

    if (err instanceof app.multipartErrors.RequestFileTooLargeError) {
      return reply.code(413).send({
        code: 'ValidationError',
        message: 'Blog banner image size must be less than 2MB.',
      });
    }

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
