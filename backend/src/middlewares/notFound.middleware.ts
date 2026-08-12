import { Request, Response } from 'express';
import { sendResponse } from '../utils/response';

export const notFoundMiddleware = (req: Request, res: Response) => {
  return sendResponse(res, 404, false, `Resource not found: ${req.method} ${req.originalUrl}`);
};
