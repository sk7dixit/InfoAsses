import { Request, Response, NextFunction } from 'express';
import { FollowUpService } from './followup.service';
import { createFollowUpSchema } from './followup.validation';
import { sendResponse } from '../../utils/response';

export class FollowUpController {
  static async getByCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const followUps = await FollowUpService.getFollowUpsByCustomer(req.params.customerId);
      return sendResponse(res, 200, true, 'Follow-ups fetched successfully', followUps);
    } catch (error) {
      next(error);
    }
  }

  static async getUpcoming(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const upcoming = await FollowUpService.getUpcomingFollowUps(limit);
      return sendResponse(res, 200, true, 'Upcoming follow-ups fetched successfully', upcoming);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createFollowUpSchema.parse(req.body);
      const createdById = req.user!.id;
      const followUp = await FollowUpService.createFollowUp(
        req.params.customerId,
        validated,
        createdById
      );
      return sendResponse(res, 201, true, 'Follow-up created successfully', followUp);
    } catch (error) {
      next(error);
    }
  }
}
