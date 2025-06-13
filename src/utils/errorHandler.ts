import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import logger from "../utils/logger";

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: any = null;

  // Handle operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errors = err.errors.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  // Log error
  if (statusCode === 500) {
    logger.error(`[${req.method}] ${req.path} >> ${err.stack}`);
  } else {
    logger.warn(`[${req.method}] ${req.path} >> ${err.message}`);
  }

  // Send error response
  res.status(statusCode).json({
    status: "error",
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
