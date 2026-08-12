import { prisma } from '../../config/database';
import cloudinary from '../../config/cloudinary';
import { ApiError } from '../../utils/response';
import { CreateProductInput, UpdateProductInput } from './product.validation';
import { Prisma } from '@prisma/client';

export class ProductService {
  static async getProducts(
    search?: string,
    category?: string,
    lowStockOnly?: boolean,
    skip: number = 0,
    limit: number = 10
  ) {
    const where: any = {};

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { productName: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (lowStockOnly) {
      where.currentStock = { lte: prisma.product.fields.minimumStock };
    }

    const [items, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, totalItems };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    return product;
  }

  static async createProduct(input: CreateProductInput, file?: Express.Multer.File) {
    const existing = await prisma.product.findUnique({
      where: { sku: input.sku },
    });
    if (existing) {
      throw new ApiError(409, `Product with SKU '${input.sku}' already exists`);
    }

    let imageUrl = input.imageUrl || null;
    let cloudinaryPublicId = null;

    if (file) {
      const uploadResult = await this.uploadToCloudinary(file);
      imageUrl = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    }

    return await prisma.product.create({
      data: {
        productName: input.productName,
        sku: input.sku,
        category: input.category,
        unitPrice: new Prisma.Decimal(input.unitPrice),
        currentStock: input.currentStock,
        minimumStock: input.minimumStock,
        warehouseLocation: input.warehouseLocation || null,
        imageUrl,
        cloudinaryPublicId,
      },
    });
  }

  static async updateProduct(id: string, input: UpdateProductInput, file?: Express.Multer.File) {
    const product = await this.getProductById(id);

    const updateData: any = {};
    if (input.productName !== undefined) updateData.productName = input.productName;
    if (input.sku !== undefined) updateData.sku = input.sku;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.unitPrice !== undefined) updateData.unitPrice = new Prisma.Decimal(input.unitPrice);
    if (input.currentStock !== undefined) updateData.currentStock = input.currentStock;
    if (input.minimumStock !== undefined) updateData.minimumStock = input.minimumStock;
    if (input.warehouseLocation !== undefined) updateData.warehouseLocation = input.warehouseLocation || null;

    if (file) {
      if (product.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(product.cloudinaryPublicId);
        } catch (e) {
          console.warn('Failed to delete existing Cloudinary image:', e);
        }
      }
      const uploadResult = await this.uploadToCloudinary(file);
      updateData.imageUrl = uploadResult.secure_url;
      updateData.cloudinaryPublicId = uploadResult.public_id;
    } else if (input.imageUrl !== undefined) {
      updateData.imageUrl = input.imageUrl || null;
    }

    return await prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteProduct(id: string) {
    const product = await this.getProductById(id);
    if (product.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(product.cloudinaryPublicId);
      } catch (e) {
        console.warn('Cloudinary delete error:', e);
      }
    }
    await prisma.product.delete({ where: { id } });
    return true;
  }

  private static async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    try {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'mini-erp-products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    } catch (error: any) {
      console.warn('Cloudinary upload warning (using Data URL fallback):', error?.message || error);
      const base64 = file.buffer.toString('base64');
      const mimeType = file.mimetype || 'image/png';
      return {
        secure_url: `data:${mimeType};base64,${base64}`,
        public_id: null,
      };
    }
  }
}
