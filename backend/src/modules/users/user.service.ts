import { prisma } from '../../config/database';
import { hashPassword } from '../../utils/password';
import { ApiError } from '../../utils/response';
import { CreateUserInput, UpdateUserInput } from './user.validation';

export class UserService {
  static async getUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  static async createUser(input: CreateUserInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);

    const newUser = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  static async updateUser(id: string, input: UpdateUserInput) {
    await this.getUserById(id);

    const updateData: any = {};
    if (input.name) updateData.name = input.name;
    if (input.email) updateData.email = input.email;
    if (input.role) updateData.role = input.role;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    if (input.password) {
      updateData.passwordHash = await hashPassword(input.password);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  static async deleteUser(id: string) {
    await this.getUserById(id);
    await prisma.user.delete({ where: { id } });
    return true;
  }
}
