/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Default error status and message
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(status).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`
    }
  });
}

