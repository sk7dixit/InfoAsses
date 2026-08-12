import { prisma } from '../../config/database';
import { ApiError } from '../../utils/response';
import { CreateCustomerInput, UpdateCustomerInput } from './customer.validation';
import { CustomerStatus, CustomerType } from '@prisma/client';

export class CustomerService {
  static async getCustomers(
    search?: string,
    status?: CustomerStatus,
    customerType?: CustomerType,
    skip: number = 0,
    limit: number = 10
  ) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (customerType) {
      where.customerType = customerType;
    }

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { businessName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { followUps: true, challans: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return { items, totalItems };
  }

  static async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        followUps: {
          include: {
            createdBy: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        challans: {
          select: {
            id: true,
            challanNumber: true,
            totalQuantity: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    return customer;
  }

  static async createCustomer(input: CreateCustomerInput) {
    return await prisma.customer.create({
      data: {
        customerName: input.customerName,
        mobile: input.mobile,
        email: input.email || null,
        businessName: input.businessName || null,
        gstNumber: input.gstNumber || null,
        customerType: input.customerType,
        address: input.address || null,
        status: input.status,
        followUpDate: input.followUpDate ? new Date(input.followUpDate) : null,
        notes: input.notes || null,
      },
    });
  }

  static async updateCustomer(id: string, input: UpdateCustomerInput) {
    await this.getCustomerById(id);

    const updateData: any = {};
    if (input.customerName !== undefined) updateData.customerName = input.customerName;
    if (input.mobile !== undefined) updateData.mobile = input.mobile;
    if (input.email !== undefined) updateData.email = input.email || null;
    if (input.businessName !== undefined) updateData.businessName = input.businessName || null;
    if (input.gstNumber !== undefined) updateData.gstNumber = input.gstNumber || null;
    if (input.customerType !== undefined) updateData.customerType = input.customerType;
    if (input.address !== undefined) updateData.address = input.address || null;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.followUpDate !== undefined) {
      updateData.followUpDate = input.followUpDate ? new Date(input.followUpDate) : null;
    }
    if (input.notes !== undefined) updateData.notes = input.notes || null;

    return await prisma.customer.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteCustomer(id: string) {
    await this.getCustomerById(id);
    await prisma.customer.delete({ where: { id } });
    return true;
  }
}
