import express from 'express';
import cors from 'cors';

import profileRoutes from './routes/profileRoutes.js';
import swipeRoutes from './routes/swipeRoutes.js';

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN ||
      'http://localhost:5174',
  }),
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
  });
});

app.use('/api/profiles', profileRoutes);

app.use('/api/swipe', swipeRoutes);

app.use((req, res) => {
  return res.status(404).json({
    message: 'Endpoint not found',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON request body',
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
});

export default app;