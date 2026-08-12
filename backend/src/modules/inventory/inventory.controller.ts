import { Request, Response, NextFunction } from 'express';
import { InventoryService } from './inventory.service';
import { createMovementSchema } from './inventory.validation';
import { getPaginationParams, formatPaginatedMeta } from '../../utils/pagination';
import { sendResponse } from '../../utils/response';
import { MovementType } from '@prisma/client';

export class InventoryController {
  static async getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const productId = req.query.productId as string | undefined;
      const movementType = req.query.movementType as MovementType | undefined;

      const { items, totalItems } = await InventoryService.getMovements(
        productId,
        movementType,
        skip,
        limit
      );

      const meta = formatPaginatedMeta(page, limit, totalItems);
      return sendResponse(res, 200, true, 'Stock movements fetched successfully', items, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await InventoryService.getLowStockProducts();
      return sendResponse(res, 200, true, 'Low stock products fetched successfully', items);
    } catch (error) {
      next(error);
    }
  }

  static async createMovement(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createMovementSchema.parse(req.body);
      const createdById = req.user!.id;
      const movement = await InventoryService.recordStockMovement(validated, createdById);
      return sendResponse(res, 201, true, 'Stock movement recorded successfully', movement);
    } catch (error) {
      next(error);
    }
  }
}
