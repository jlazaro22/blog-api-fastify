import closeWithGrace from 'close-with-grace';

import { app } from './app';
import { env } from './env';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';

(async () => {
  try {
    await connectToDatabase();
    await app
      .listen({
        host: env.HOST,
        port: env.PORT,
      })
      .then(() => {
        app.log.info(`HTTP Server up on http://localhost:${env.PORT}`);
      })
      .catch((err) => {
        app.log.error(err);
        process.exit(1);
      });

    closeWithGrace(
      { delay: env.CLOSE_WITH_GRACE_DELAY ?? 500 },
      async ({ signal, err }) => {
        if (err) {
          app.log.error({ err }, 'Error during server shutdown.');
        } else {
          await disconnectFromDatabase();
          app.log.info(`${signal} signal received, server SHUTDOWN.`);
        }

        await app.close();
      },
    );
  } catch (err) {
    app.log.error(err, 'Failed to start the server.');

    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();
