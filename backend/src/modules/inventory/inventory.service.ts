import { prisma } from '../../config/database';
import { ApiError } from '../../utils/response';
import { CreateMovementInput } from './inventory.validation';
import { MovementType } from '@prisma/client';

export class InventoryService {
  static async getMovements(
    productId?: string,
    movementType?: MovementType,
    skip: number = 0,
    limit: number = 10
  ) {
    const where: any = {};
    if (productId) where.productId = productId;
    if (movementType) where.movementType = movementType;

    const [items, totalItems] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, productName: true, sku: true, category: true } },
          createdBy: { select: { id: true, name: true, role: true } },
        },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { items, totalItems };
  }

  static async getLowStockProducts() {
    // Find products where currentStock <= minimumStock
    const allProducts = await prisma.product.findMany({
      orderBy: { currentStock: 'asc' },
    });

    return allProducts.filter((p) => p.currentStock <= p.minimumStock);
  }

  static async recordStockMovement(input: CreateMovementInput, createdById: string) {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      if (input.movementType === MovementType.OUT && product.currentStock < input.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for '${product.productName}'. Available: ${product.currentStock}, Requested: ${input.quantity}`
        );
      }

      const newStock =
        input.movementType === MovementType.IN
          ? product.currentStock + input.quantity
          : product.currentStock - input.quantity;

      const [movement] = await Promise.all([
        tx.stockMovement.create({
          data: {
            productId: input.productId,
            quantity: input.quantity,
            movementType: input.movementType,
            reason: input.reason,
            createdById,
          },
          include: {
            product: { select: { id: true, productName: true, sku: true } },
            createdBy: { select: { id: true, name: true } },
          },
        }),
        tx.product.update({
          where: { id: input.productId },
          data: { currentStock: newStock },
        }),
      ]);

      return movement;
    });
  }
}
