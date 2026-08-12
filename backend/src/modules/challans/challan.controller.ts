import { Request, Response, NextFunction } from 'express';
import { ChallanService } from './challan.service';
import { createChallanSchema, updateChallanSchema } from './challan.validation';
import { getPaginationParams, formatPaginatedMeta } from '../../utils/pagination';
import { sendResponse } from '../../utils/response';
import { ChallanStatus } from '@prisma/client';

export class ChallanController {
  static async getChallans(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const status = req.query.status as ChallanStatus | undefined;
      const search = req.query.search as string | undefined;

      const { items, totalItems } = await ChallanService.getChallans(status, search, skip, limit);

      const meta = formatPaginatedMeta(page, limit, totalItems);
      return sendResponse(res, 200, true, 'Challans fetched successfully', items, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getChallanById(req: Request, res: Response, next: NextFunction) {
    try {
      const challan = await ChallanService.getChallanById(req.params.id);
      return sendResponse(res, 200, true, 'Challan fetched successfully', challan);
    } catch (error) {
      next(error);
    }
  }

  static async createChallan(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createChallanSchema.parse(req.body);
      const createdById = req.user!.id;
      const challan = await ChallanService.createChallan(validated, createdById);
      return sendResponse(res, 201, true, 'Draft challan created successfully', challan);
    } catch (error) {
      next(error);
    }
  }

  static async updateChallan(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateChallanSchema.parse(req.body);
      const challan = await ChallanService.updateChallan(req.params.id, validated);
      return sendResponse(res, 200, true, 'Draft challan updated successfully', challan);
    } catch (error) {
      next(error);
    }
  }

  static async confirmChallan(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const challan = await ChallanService.confirmChallan(req.params.id, userId);
      return sendResponse(res, 200, true, 'Challan confirmed and stock updated successfully', challan);
    } catch (error) {
      next(error);
    }
  }

  static async cancelChallan(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const challan = await ChallanService.cancelChallan(req.params.id, userId);
      return sendResponse(res, 200, true, 'Challan cancelled successfully', challan);
    } catch (error) {
      next(error);
    }
  }
}
