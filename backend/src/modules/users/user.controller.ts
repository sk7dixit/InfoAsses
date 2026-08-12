import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { createUserSchema, updateUserSchema } from './user.validation';
import { sendResponse } from '../../utils/response';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getUsers();
      return sendResponse(res, 200, true, 'Users fetched successfully', users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return sendResponse(res, 200, true, 'User fetched successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createUserSchema.parse(req.body);
      const user = await UserService.createUser(validated);
      return sendResponse(res, 201, true, 'User created successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateUserSchema.parse(req.body);
      const user = await UserService.updateUser(req.params.id, validated);
      return sendResponse(res, 200, true, 'User updated successfully', user);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.params.id);
      return sendResponse(res, 200, true, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
