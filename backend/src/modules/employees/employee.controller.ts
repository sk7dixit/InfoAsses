import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.validation';
import { sendResponse } from '../../utils/response';

export class EmployeeController {
  static async getEmployees(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await EmployeeService.getEmployees(req.query as any);
      return sendResponse(res, 200, true, 'Employees retrieved successfully', result.items, {
        page: result.page,
        limit: result.limit,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await EmployeeService.getEmployeeById(req.params.id);
      return sendResponse(res, 200, true, 'Employee retrieved successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  static async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createEmployeeSchema.parse(req.body);
      const employee = await EmployeeService.createEmployee(validated);
      return sendResponse(res, 201, true, 'Employee created successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateEmployeeSchema.parse(req.body);
      const employee = await EmployeeService.updateEmployee(req.params.id, validated);
      return sendResponse(res, 200, true, 'Employee updated successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  static async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, loginEnabled } = req.body;
      const employee = await EmployeeService.toggleEmployeeStatus(req.params.id, status, loginEnabled);
      return sendResponse(res, 200, true, 'Employee status updated successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await EmployeeService.getEmployeeStats();
      return sendResponse(res, 200, true, 'Employee statistics fetched', stats);
    } catch (error) {
      next(error);
    }
  }
}
