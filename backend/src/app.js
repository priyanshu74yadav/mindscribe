import express from 'express';
import cors from 'cors';
import { PORT } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MindScribe API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MindScribe Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API endpoints:`);
  console.log(`   POST /api/transcribe - Audio to text`);
  console.log(`   POST /api/summarize - Summarize text`);
  console.log(`   POST /api/tts - Text to speech`);
  console.log(`   POST /api/saveNote - Save note`);
  console.log(`   GET  /api/notes?userId={id} - Get notes`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

