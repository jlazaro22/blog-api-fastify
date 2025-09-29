import { FastifyReply, FastifyRequest } from 'fastify';

import { app } from 'app';
import User from 'models/user';
import { updateCurrentUserBodySchema } from './validations/user-validation-schemas';

export async function updateCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const { sub: userId } = request.user;
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    website,
    facebook,
    instagram,
    x,
    youtube,
    linkedin,
  } = updateCurrentUserBodySchema.parse(request.body);

  try {
    const user = await User.findById(userId).select('+password -__v').exec();

    if (!user) {
      return reply.code(404).send({
        code: 'NotFound',
        message: 'User not found.',
      });
    }

    if (username) {
      const userExists = await User.exists({ username });

      if (userExists) {
        return reply
          .code(400)
          .send({ message: 'This username is already in use.' });
      }

      user.username = username;
    }

    if (email) {
      const userExists = await User.exists({ email });

      if (userExists) {
        return reply
          .code(400)
          .send({ message: 'This email is already in use.' });
      }

      user.email = email;
    }

    if (password) user.password = password;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (!user.socialLinks) user.socialLinks = {};
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;
    if (linkedin) user.socialLinks.linkedin = linkedin;

    await user.save();
    app.log.info(user, 'User updated successfully.');

    return reply.code(200).send({ user });
  } catch (err) {
    app.log.error(err, 'Error while updating the current user.');

    return reply.code(500).send({
      code: 'ServerError',
      message: 'Internal server error.',
      error: err,
    });
  }
}
