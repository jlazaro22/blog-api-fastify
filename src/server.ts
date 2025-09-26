import closeWithGrace from 'close-with-grace';

import { app } from './app.js';
import { env } from './env/index.js';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose.js';

(async () => {
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

  await app.ready();

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
  } catch (err) {
    app.log.error(err, 'Failed to start the server.');

    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();
