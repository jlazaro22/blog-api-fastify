import mongoose, { ConnectOptions } from 'mongoose';

import { app } from 'app';
import { env } from 'env';

const clientOptions: ConnectOptions = {
  dbName: 'blog-api-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI, clientOptions);

    app.log.info(
      {
        uri: env.MONGO_URI,
        options: clientOptions,
      },
      'Connected to the database successfully.',
    );
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    app.log.error(err, 'Failed to connect to the database.');
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();

    app.log.info(
      {
        uri: env.MONGO_URI,
        options: clientOptions,
      },
      'Disconnected from the database successfully.',
    );
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    app.log.error(err, 'Failed to disconnect from the database.');
  }
}
