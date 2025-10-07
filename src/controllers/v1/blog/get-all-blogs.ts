import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import config from 'config';
import Blog from 'models/blog';
import User from 'models/user';
import { getBlogsQuerySchema } from './validations/blog-validation-schemas';

interface QueryType {
  status?: 'draft' | 'published';
}

export async function getAllBlogs(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    const userId = request.user.sub;
    const { limit, offset } = getBlogsQuerySchema.parse(request.query);

    const user = await User.findById(userId).select('role').lean().exec();
    const query: QueryType = {};

    if (user?.role === 'user') {
      query.status = 'published';
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .limit(limit || config.defaultResLimit)
      .skip(offset || config.defaultResOffset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return reply.code(200).send({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (err) {
    app.log.error(err, 'Error while fetching blogs.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
