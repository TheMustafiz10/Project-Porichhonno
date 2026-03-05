import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/database';

// Import routes
import logsRouter from './routes/logs';
import usersRouter from './routes/users';
import scrapRatesRouter from './routes/scrapRates';
import ecoTipsRouter from './routes/ecoTips';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/logs', logsRouter);
app.use('/api/users', usersRouter);
app.use('/api/scrap-rates', scrapRatesRouter);
app.use('/api/eco-tips', ecoTipsRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'পরিচ্ছন্ন API is running' });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🌿 পরিচ্ছন্ন Backend API',
    version: '1.0.0',
    endpoints: {
      logs: '/api/logs',
      users: '/api/users',
      scrapRates: '/api/scrap-rates',
      ecoTips: '/api/eco-tips',
      health: '/api/health',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
