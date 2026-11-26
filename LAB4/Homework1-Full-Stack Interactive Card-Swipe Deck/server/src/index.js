import 'dotenv/config';

import app from './app.js';

import {
  connectDatabase,
  disconnectDatabase,
} from './config/database.js';

import Profile from './models/Profile.js';
import Swipe from './models/Swipe.js';

const port = Number(process.env.PORT || 3001);

async function startServer() {
  try {
    await connectDatabase();

    await Profile.init();
    await Swipe.init();

    console.log('Connected to MongoDB');

    const server = app.listen(port, () => {
      console.log(
        `Server is running at http://localhost:${port}`,
      );
    });

    server.on('error', async (error) => {
      console.error('HTTP server failed:', error.message);

      await disconnectDatabase();

      process.exitCode = 1;
    });

    let shuttingDown = false;

    async function shutdown() {
      if (shuttingDown) {
        return;
      }

      shuttingDown = true;

      server.close(async () => {
        await disconnectDatabase();

        console.log('Server stopped');
      });
    }

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    console.error(
      'Server startup failed:',
      error.message,
    );

    await disconnectDatabase();

    process.exitCode = 1;
  }
}

await startServer();