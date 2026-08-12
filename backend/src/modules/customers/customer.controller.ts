import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';
import { createCustomerSchema, updateCustomerSchema } from './customer.validation';
import { getPaginationParams, formatPaginatedMeta } from '../../utils/pagination';
import { sendResponse } from '../../utils/response';
import { CustomerStatus, CustomerType } from '@prisma/client';

export class CustomerController {
  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const search = req.query.search as string | undefined;
      const status = req.query.status as CustomerStatus | undefined;
      const customerType = req.query.customerType as CustomerType | undefined;

      const { items, totalItems } = await CustomerService.getCustomers(
        search,
        status,
        customerType,
        skip,
        limit
      );

      const meta = formatPaginatedMeta(page, limit, totalItems);
      return sendResponse(res, 200, true, 'Customers fetched successfully', items, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id);
      return sendResponse(res, 200, true, 'Customer fetched successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createCustomerSchema.parse(req.body);
      const customer = await CustomerService.createCustomer(validated);
      return sendResponse(res, 201, true, 'Customer created successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = updateCustomerSchema.parse(req.body);
      const customer = await CustomerService.updateCustomer(req.params.id, validated);
      return sendResponse(res, 200, true, 'Customer updated successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      await CustomerService.deleteCustomer(req.params.id);
      return sendResponse(res, 200, true, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
