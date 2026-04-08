import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import { AppDataSource } from './data-source';
import routes from './routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (disabled in test environment)
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to SQLite database via TypeORM.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API base URL: http://localhost:${PORT}/api/resources`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await AppDataSource.destroy();
  process.exit(0);
});

// Only start the server if this file is run directly (not imported for testing)
if (require.main === module) {
  startServer();
}

export { app, startServer };
