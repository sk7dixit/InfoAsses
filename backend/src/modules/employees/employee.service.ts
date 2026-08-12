import { PrismaClient, Role, EmploymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class EmployeeService {
  static async getEmployees(query: { search?: string; role?: Role; status?: EmploymentStatus; limit?: number; page?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      const search = query.search.trim();
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      items,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  static async getEmployeeById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!employee) {
      const error: any = new Error('Employee record not found');
      error.statusCode = 404;
      throw error;
    }

    return employee;
  }

  static async createEmployee(data: any) {
    // Check existing ID or Email
    const existingId = await prisma.employee.findUnique({ where: { employeeId: data.employeeId } });
    if (existingId) {
      const error: any = new Error(`Employee ID '${data.employeeId}' already exists`);
      error.statusCode = 400;
      throw error;
    }

    const existingEmail = await prisma.employee.findUnique({ where: { email: data.email } });
    if (existingEmail) {
      const error: any = new Error(`Employee with email '${data.email}' already exists`);
      error.statusCode = 400;
      throw error;
    }

    let createdUserId: string | undefined;

    if (data.loginEnabled) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.employeeId }],
        },
      });
      if (existingUser) {
        createdUserId = existingUser.id;
      } else {
        const rawPass = data.password || 'Emp@2026';
        const passwordHash = await bcrypt.hash(rawPass, 10);
        const newUser = await prisma.user.create({
          data: {
            username: data.employeeId,
            name: data.fullName,
            email: data.email,
            passwordHash,
            role: data.role,
            isActive: data.status !== 'INACTIVE',
          },
        });
        createdUserId = newUser.id;
      }
    }

    const joiningDate = data.joiningDate ? new Date(data.joiningDate) : new Date();
    const contractStart = data.contractStart ? new Date(data.contractStart) : null;
    const contractEnd = data.contractEnd ? new Date(data.contractEnd) : null;

    const employee = await prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        joiningDate,
        contractStart,
        contractEnd,
        status: data.status || 'ACTIVE',
        loginEnabled: Boolean(data.loginEnabled),
        notes: data.notes || null,
        userId: createdUserId || null,
      },
      include: {
        user: true,
      },
    });

    return employee;
  }

  static async updateEmployee(id: string, data: any) {
    const existing = await this.getEmployeeById(id);

    const updateData: any = { ...data };
    if (data.joiningDate) updateData.joiningDate = new Date(data.joiningDate);
    if (data.contractStart) updateData.contractStart = new Date(data.contractStart);
    if (data.contractEnd) updateData.contractEnd = new Date(data.contractEnd);

    if (data.status === 'INACTIVE' && existing.status !== 'INACTIVE') {
      updateData.lastWorkingDate = new Date();
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });

    // Sync user active state if linked
    if (updated.userId) {
      await prisma.user.update({
        where: { id: updated.userId },
        data: {
          role: updated.role,
          isActive: updated.status !== 'INACTIVE' && updated.loginEnabled,
        },
      });
    }

    return updated;
  }

  static async toggleEmployeeStatus(id: string, status: EmploymentStatus, loginEnabled: boolean) {
    const existing = await this.getEmployeeById(id);

    const updateData: any = {
      status,
      loginEnabled,
    };

    if (status === 'INACTIVE') {
      updateData.lastWorkingDate = new Date();
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: { user: true },
    });

    if (updated.userId) {
      await prisma.user.update({
        where: { id: updated.userId },
        data: {
          isActive: status !== 'INACTIVE' && loginEnabled,
        },
      });
    }

    return updated;
  }

  static async getEmployeeStats() {
    const [total, active, onContract, inactive, sales, warehouse, accounts, admin] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
      prisma.employee.count({ where: { status: 'ON_CONTRACT' } }),
      prisma.employee.count({ where: { status: 'INACTIVE' } }),
      prisma.employee.count({ where: { role: 'SALES' } }),
      prisma.employee.count({ where: { role: 'WAREHOUSE' } }),
      prisma.employee.count({ where: { role: 'ACCOUNTS' } }),
      prisma.employee.count({ where: { role: 'ADMIN' } }),
    ]);

    return {
      total,
      active,
      onContract,
      inactive,
      roles: {
        sales,
        warehouse,
        accounts,
        admin,
      },
    };
  }
}
