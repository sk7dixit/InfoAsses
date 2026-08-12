import { Request } from 'express';

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationParams = (req: Request, defaultLimit: number = 10): PaginationQuery => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const formatPaginatedMeta = (page: number, limit: number, totalItems: number) => {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  return {
    page,
    limit,
    totalItems,
    totalPages,
  };
};
