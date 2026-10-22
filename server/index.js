import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { analyzeRouter } from './routes/analyze.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS configuration restricted to CLIENT_ORIGIN
const allowedOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// 3. Request body parsing limited to 20kb
app.use(express.json({ limit: '20kb' }));

// 4. Privacy-safe request logger: logs only method, path, status, and duration (never logs content)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// 5. Rate Limiting for /api/analyze (20 requests per minute per IP)
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded: maximum 20 requests per minute. Please try again shortly.' }
});

// 6. Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/analyze', analyzeLimiter, analyzeRouter);

// 7. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 8. Centralized Error Handler (Never leaks stack traces or credentials)
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const clientMessage = statusCode === 500 ? 'Internal server error' : (err.message || 'An unexpected error occurred');
  
  console.error(`Error on ${req.method} ${req.originalUrl} [${statusCode}]:`, err.message);

  res.status(statusCode).json({
    error: clientMessage
  });
});

// 9. Server Initialization
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🛡️ Scamouflage backend running on port ${PORT}`);
    console.log(`🌐 Allowed CORS Origin: ${CLIENT_ORIGIN}`);
  });
}

export default app;
