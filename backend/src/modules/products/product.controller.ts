import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { createProductSchema, updateProductSchema } from './product.validation';
import { getPaginationParams, formatPaginatedMeta } from '../../utils/pagination';
import { sendResponse } from '../../utils/response';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const lowStockOnly = req.query.lowStock === 'true';

      const { items, totalItems } = await ProductService.getProducts(
        search,
        category,
        lowStockOnly,
        skip,
        limit
      );

      const meta = formatPaginatedMeta(page, limit, totalItems);
      return sendResponse(res, 200, true, 'Products fetched successfully', items, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return sendResponse(res, 200, true, 'Product fetched successfully', product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createProductSchema.parse(req.body);
      const file = req.file;
      const product = await ProductService.createProduct(validated, file);
      return sendResponse(res, 201, true, 'Product created successfully', product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateProductSchema.parse(req.body);
      const file = req.file;
      const product = await ProductService.updateProduct(req.params.id, validated, file);
      return sendResponse(res, 200, true, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id);
      return sendResponse(res, 200, true, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
