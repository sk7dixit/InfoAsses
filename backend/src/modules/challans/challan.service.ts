import { prisma } from '../../config/database';
import { generateNextChallanNumber } from '../../utils/challanNumber';
import { ApiError } from '../../utils/response';
import { CreateChallanInput, UpdateChallanInput } from './challan.validation';
import { ChallanStatus, MovementType } from '@prisma/client';

export class ChallanService {
  static async getChallans(
    status?: ChallanStatus,
    search?: string,
    skip: number = 0,
    limit: number = 10
  ) {
    const where: any = {};
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { challanNumber: { contains: search, mode: 'insensitive' } },
        { customer: { customerName: { contains: search, mode: 'insensitive' } } },
        { customer: { businessName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      prisma.challan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, customerName: true, businessName: true, mobile: true },
          },
          createdBy: { select: { id: true, name: true, role: true } },
          items: true,
        },
      }),
      prisma.challan.count({ where }),
    ]);

    return { items, totalItems };
  }

  static async getChallanById(id: string) {
    const challan = await prisma.challan.findUnique({
      where: { id },
      include: {
        customer: true,
        createdBy: { select: { id: true, name: true, role: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, currentStock: true, imageUrl: true } },
          },
        },
      },
    });

    if (!challan) {
      throw new ApiError(404, 'Challan not found');
    }

    return challan;
  }

  static async createChallan(input: CreateChallanInput, createdById: string) {
    // 1. Verify Customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
    });
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    // 2. Fetch products and build snapshots
    const productIds = input.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new ApiError(400, 'One or more selected products do not exist');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalQuantity = 0;

    const itemsData = input.items.map((item) => {
      const p = productMap.get(item.productId)!;
      totalQuantity += item.quantity;
      return {
        productId: item.productId,
        productNameSnapshot: p.productName,
        skuSnapshot: p.sku,
        unitPriceSnapshot: p.unitPrice,
        quantity: item.quantity,
      };
    });

    const challanNumber = await generateNextChallanNumber();

    return await prisma.challan.create({
      data: {
        challanNumber,
        customerId: input.customerId,
        totalQuantity,
        status: ChallanStatus.DRAFT,
        createdById,
        items: {
          create: itemsData,
        },
      },
      include: {
        customer: true,
        items: true,
        createdBy: { select: { id: true, name: true } },
      },
    });
  }

  static async updateChallan(id: string, input: UpdateChallanInput) {
    const challan = await this.getChallanById(id);
    if (challan.status !== ChallanStatus.DRAFT) {
      throw new ApiError(400, `Cannot modify a challan that is already ${challan.status}`);
    }

    let totalQuantity = challan.totalQuantity;
    let itemsUpdateData: any = undefined;

    if (input.items && input.items.length > 0) {
      const productIds = input.items.map((i) => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new ApiError(400, 'One or more selected products do not exist');
      }

      const productMap = new Map(products.map((p) => [p.id, p]));
      totalQuantity = 0;

      const newItems = input.items.map((item) => {
        const p = productMap.get(item.productId)!;
        totalQuantity += item.quantity;
        return {
          productId: item.productId,
          productNameSnapshot: p.productName,
          skuSnapshot: p.sku,
          unitPriceSnapshot: p.unitPrice,
          quantity: item.quantity,
        };
      });

      itemsUpdateData = {
        deleteMany: {},
        create: newItems,
      };
    }

    return await prisma.challan.update({
      where: { id },
      data: {
        ...(input.customerId && { customerId: input.customerId }),
        totalQuantity,
        ...(itemsUpdateData && { items: itemsUpdateData }),
      },
      include: {
        customer: true,
        items: true,
      },
    });
  }

  static async confirmChallan(id: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Lock and fetch challan with items
      const challan = await tx.challan.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!challan) {
        throw new ApiError(404, 'Challan not found');
      }

      if (challan.status === ChallanStatus.CONFIRMED) {
        throw new ApiError(400, 'Challan is already confirmed');
      }

      if (challan.status === ChallanStatus.CANCELLED) {
        throw new ApiError(400, 'Cannot confirm a cancelled challan');
      }

      // 2. Stock Availability Check for ALL items
      const stockErrors: { field: string; message: string }[] = [];

      for (const item of challan.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          stockErrors.push({
            field: item.productId,
            message: `Product '${item.productNameSnapshot}' no longer exists in inventory`,
          });
          continue;
        }

        if (product.currentStock < item.quantity) {
          stockErrors.push({
            field: item.productId,
            message: `Insufficient stock for '${product.productName}'. Available: ${product.currentStock}, Requested: ${item.quantity}`,
          });
        }
      }

      if (stockErrors.length > 0) {
        throw new ApiError(400, 'Insufficient stock to confirm challan', stockErrors);
      }

      // 3. Deduct Stock & Record OUT movements
      for (const item of challan.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: { decrement: item.quantity },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            movementType: MovementType.OUT,
            reason: `Sales Challan ${challan.challanNumber}`,
            createdById: userId,
          },
        });
      }

      // 4. Set Challan Status to CONFIRMED
      const confirmedChallan = await tx.challan.update({
        where: { id },
        data: { status: ChallanStatus.CONFIRMED },
        include: {
          customer: true,
          items: true,
          createdBy: { select: { id: true, name: true } },
        },
      });

      return confirmedChallan;
    });
  }

  static async cancelChallan(id: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const challan = await tx.challan.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!challan) {
        throw new ApiError(404, 'Challan not found');
      }

      if (challan.status === ChallanStatus.CANCELLED) {
        throw new ApiError(400, 'Challan is already cancelled');
      }

      // If it was confirmed, restore stock
      if (challan.status === ChallanStatus.CONFIRMED) {
        for (const item of challan.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { currentStock: { increment: item.quantity } },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              movementType: MovementType.IN,
              reason: `Cancelled Sales Challan ${challan.challanNumber}`,
              createdById: userId,
            },
          });
        }
      }

      return await tx.challan.update({
        where: { id },
        data: { status: ChallanStatus.CANCELLED },
        include: { customer: true, items: true },
      });
    });
  }
}
