import { ApiError } from "../utils/ApiError.js";

/**
 * Global Express error handler middleware
 * Catches all errors thrown across the application and returns consistent responses
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose — invalid ObjectId
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid ID format: ${err.value}`);
  }

  // Mongoose — duplicate key violation (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `${field} already exists. Please use another.`);
  }

  // Mongoose — validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, messages.join(". "));
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("🔴 Error:", err);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message || "Internal Server Error",
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorHandler };
