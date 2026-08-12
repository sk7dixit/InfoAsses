import { prisma } from '../../config/database';
import { comparePassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { ApiError } from '../../utils/response';
import { LoginInput } from './auth.validation';

export class AuthService {
  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { employee: true },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check account status
    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been disabled. Please contact the administrator.');
    }

    if (user.employee && (user.employee.status === 'INACTIVE' || !user.employee.loginEnabled)) {
      throw new ApiError(403, 'Your account has been disabled. Please contact the administrator.');
    }

    // Check password
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check role mismatch if selectedRole was provided by UI
    if (input.role && input.role.toUpperCase() !== user.role) {
      throw new ApiError(
        401,
        `Role mismatch for account '${user.email}'. You selected '${input.role}' but your assigned role is '${user.role}'.`
      );
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = signToken(tokenPayload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }

    return user;
  }
}
