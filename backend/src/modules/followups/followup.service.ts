import { prisma } from '../../config/database';
import { ApiError } from '../../utils/response';
import { CreateFollowUpInput } from './followup.validation';

export class FollowUpService {
  static async getFollowUpsByCustomer(customerId: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    return await prisma.followUp.findMany({
      where: { customerId },
      include: {
        createdBy: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUpcomingFollowUps(limit: number = 10) {
    return await prisma.customer.findMany({
      where: {
        followUpDate: {
          gte: new Date(),
        },
      },
      orderBy: { followUpDate: 'asc' },
      take: limit,
      select: {
        id: true,
        customerName: true,
        businessName: true,
        mobile: true,
        followUpDate: true,
        status: true,
      },
    });
  }

  static async createFollowUp(customerId: string, input: CreateFollowUpInput, createdById: string) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    const followUpDateTime = new Date(input.followUpDate);

    const [followUp] = await prisma.$transaction([
      prisma.followUp.create({
        data: {
          customerId,
          note: input.note,
          followUpDate: followUpDateTime,
          createdById,
        },
        include: {
          createdBy: { select: { id: true, name: true, role: true } },
        },
      }),
      prisma.customer.update({
        where: { id: customerId },
        data: {
          followUpDate: followUpDateTime,
        },
      }),
    ]);

    return followUp;
  }
}
