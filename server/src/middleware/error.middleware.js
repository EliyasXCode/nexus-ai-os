export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Friendly messages for common errors
  let friendlyMessage = err.message || 'An unexpected error occurred in NEXUS AI OS';

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    friendlyMessage = 'Invalid ID format provided';
  } else if (err.code === 11000) {
    friendlyMessage = 'A record with that information already exists';
  } else if (err.name === 'ValidationError') {
    friendlyMessage = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: friendlyMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
