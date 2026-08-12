import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  meta?: ApiResponse['meta'],
  errors?: any[]
) => {
  const payload: ApiResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
    ...(errors !== undefined && { errors }),
  };
  return res.status(statusCode).json(payload);
};
