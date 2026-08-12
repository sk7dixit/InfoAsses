import { Request, Response, NextFunction } from 'express';
import { ApiError, sendResponse } from '../utils/response';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      console.error(`[Server Error] ${req.method} ${req.url}:`, err);
    }
    return sendResponse(res, err.statusCode, false, err.message, undefined, undefined, err.errors);
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendResponse(res, 422, false, 'Validation failed', undefined, undefined, formattedErrors);
  }

  // Handle Prisma errors or unknown exceptions
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Server error';
  return sendResponse(res, 500, false, message);
};
