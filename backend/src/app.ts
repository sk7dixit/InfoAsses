import express from 'express';
import cors from 'cors';
import routes from './routes';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';

const app = express();

// Middlewares
app.use(cors({ origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', routes);

// 404 & Error Handlers
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
