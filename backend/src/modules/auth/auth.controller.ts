import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { loginSchema } from './auth.validation';
import { sendResponse } from '../../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated);
      return sendResponse(res, 200, true, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await AuthService.getMe(userId);
      return sendResponse(res, 200, true, 'User profile fetched successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      return sendResponse(res, 200, true, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }
}

