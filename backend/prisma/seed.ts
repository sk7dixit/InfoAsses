import { PrismaClient, Role, CustomerType, CustomerStatus, MovementType, ChallanStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const passwordHashAdmin = await bcrypt.hash('admin123', 10);
  const passwordHashSales = await bcrypt.hash('sales123', 10);
  const passwordHashWarehouse = await bcrypt.hash('warehouse123', 10);
  const passwordHashAccounts = await bcrypt.hash('accounts123', 10);

  // 1. Upsert Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@erp.com',
      passwordHash: passwordHashAdmin,
      role: Role.ADMIN,
    },
  });

  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@erp.com' },
    update: {},
    create: {
      name: 'Sarah Sales Manager',
      email: 'sales@erp.com',
      passwordHash: passwordHashSales,
      role: Role.SALES,
    },
  });

  const warehouseUser = await prisma.user.upsert({
    where: { email: 'warehouse@erp.com' },
    update: {},
    create: {
      name: 'Wayne Warehouse Lead',
      email: 'warehouse@erp.com',
      passwordHash: passwordHashWarehouse,
      role: Role.WAREHOUSE,
    },
  });

  const accountsUser = await prisma.user.upsert({
    where: { email: 'accounts@erp.com' },
    update: {},
    create: {
      name: 'Alex Accounts Executive',
      email: 'accounts@erp.com',
      passwordHash: passwordHashAccounts,
      role: Role.ACCOUNTS,
    },
  });

  console.log('✅ Users seeded: Admin, Sales, Warehouse, Accounts');

  // Upsert Employee Records
  await prisma.employee.upsert({
    where: { employeeId: 'EMP-000' },
    update: {},
    create: {
      employeeId: 'EMP-000',
      fullName: 'System Administrator',
      email: 'admin@erp.com',
      phone: '+91 9876500000',
      role: Role.ADMIN,
      joiningDate: new Date('2025-01-01'),
      status: 'ACTIVE',
      loginEnabled: true,
      userId: adminUser.id,
    },
  });

  await prisma.employee.upsert({
    where: { employeeId: 'EMP-001' },
    update: {},
    create: {
      employeeId: 'EMP-001',
      fullName: 'Sarah Sales Manager',
      email: 'sales@erp.com',
      phone: '+91 9876500001',
      role: Role.SALES,
      joiningDate: new Date('2026-01-12'),
      status: 'ACTIVE',
      loginEnabled: true,
      userId: salesUser.id,
    },
  });

  await prisma.employee.upsert({
    where: { employeeId: 'EMP-002' },
    update: {},
    create: {
      employeeId: 'EMP-002',
      fullName: 'Wayne Warehouse Lead',
      email: 'warehouse@erp.com',
      phone: '+91 9876500002',
      role: Role.WAREHOUSE,
      joiningDate: new Date('2025-11-18'),
      contractStart: new Date('2025-11-18'),
      contractEnd: new Date('2026-12-31'),
      status: 'ACTIVE',
      loginEnabled: true,
      userId: warehouseUser.id,
    },
  });

  await prisma.employee.upsert({
    where: { employeeId: 'EMP-003' },
    update: {},
    create: {
      employeeId: 'EMP-003',
      fullName: 'Alex Accounts Executive',
      email: 'accounts@erp.com',
      phone: '+91 9876500003',
      role: Role.ACCOUNTS,
      joiningDate: new Date('2026-03-06'),
      status: 'ACTIVE',
      loginEnabled: true,
      userId: accountsUser.id,
    },
  });

  await prisma.employee.upsert({
    where: { employeeId: 'EMP-004' },
    update: {},
    create: {
      employeeId: 'EMP-004',
      fullName: 'Amit Sharma',
      email: 'amit.sharma@erp.com',
      phone: '+91 9876500004',
      role: Role.SALES,
      joiningDate: new Date('2026-02-01'),
      status: 'ACTIVE',
      loginEnabled: true,
    },
  });

  await prisma.employee.upsert({
    where: { employeeId: 'EMP-005' },
    update: {},
    create: {
      employeeId: 'EMP-005',
      fullName: 'Neha Patel',
      email: 'neha.patel@erp.com',
      phone: '+91 9876500005',
      role: Role.SALES,
      joiningDate: new Date('2026-02-15'),
      status: 'ACTIVE',
      loginEnabled: true,
    },
  });

  console.log('✅ Employee records seeded');

  // 2. Seed Customers
  const customer1 = await prisma.customer.create({
    data: {
      customerName: 'Acme Technologies Pvt Ltd',
      mobile: '+91 9876543210',
      email: 'procurement@acmetech.com',
      businessName: 'Acme Tech Solutions',
      gstNumber: '27AAAAA0000A1Z5',
      customerType: CustomerType.WHOLESALE,
      address: 'Plot 42, Tech Park, Phase 1, Bangalore',
      status: CustomerStatus.ACTIVE,
      notes: 'Key enterprise buyer for IT hardware.',
      followUpDate: new Date(Date.now() + 3 * 86400000), // in 3 days
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      customerName: 'Rajesh Sharma',
      mobile: '+91 9123456789',
      email: 'rajesh.sharma@gmail.com',
      businessName: 'Sharma General Store',
      customerType: CustomerType.RETAIL,
      address: 'Shop No 12, Main Market, Mumbai',
      status: CustomerStatus.LEAD,
      notes: 'Interested in bulk keyboard & mouse sets.',
      followUpDate: new Date(Date.now() + 1 * 86400000), // in 1 day
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      customerName: 'Global Distro Corp',
      mobile: '+91 9988776655',
      email: 'orders@globaldistro.in',
      businessName: 'Global Distributors',
      gstNumber: '07BBBBB1111B2Z3',
      customerType: CustomerType.DISTRIBUTOR,
      address: 'G-14, Industrial Estate, Noida',
      status: CustomerStatus.ACTIVE,
      notes: 'Quarterly order contract client.',
      followUpDate: new Date(Date.now() + 5 * 86400000),
    },
  });

  console.log('✅ Customers seeded');

  // Seed FollowUps
  await prisma.followUp.createMany({
    data: [
      {
        customerId: customer1.id,
        note: 'Sent quotation for 25 Workstation Laptops.',
        followUpDate: new Date(),
        createdById: salesUser.id,
      },
      {
        customerId: customer2.id,
        note: 'Initial phone enquiry regarding 4K monitors.',
        followUpDate: new Date(),
        createdById: salesUser.id,
      },
    ],
  });

  // 3. Seed Products
  const p1 = await prisma.product.upsert({
    where: { sku: 'LAP-PRO-001' },
    update: {},
    create: {
      productName: 'Pro Laptop 15-inch M3',
      sku: 'LAP-PRO-001',
      category: 'Laptops',
      unitPrice: 89999.00,
      currentStock: 15,
      minimumStock: 5,
      warehouseLocation: 'Shelf A-101',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    },
  });

  const p2 = await prisma.product.upsert({
    where: { sku: 'KEY-MECH-002' },
    update: {},
    create: {
      productName: 'Ergonomic Mechanical Keyboard',
      sku: 'KEY-MECH-002',
      category: 'Peripherals',
      unitPrice: 4500.00,
      currentStock: 45,
      minimumStock: 10,
      warehouseLocation: 'Shelf B-204',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    },
  });

  const p3 = await prisma.product.upsert({
    where: { sku: 'MON-34-003' },
    update: {},
    create: {
      productName: 'UltraWide 34" 144Hz Monitor',
      sku: 'MON-34-003',
      category: 'Monitors',
      unitPrice: 32999.00,
      currentStock: 3, // Low stock on purpose!
      minimumStock: 5,
      warehouseLocation: 'Shelf C-301',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    },
  });

  const p4 = await prisma.product.upsert({
    where: { sku: 'MOU-WL-004' },
    update: {},
    create: {
      productName: 'Wireless Precision Gaming Mouse',
      sku: 'MOU-WL-004',
      category: 'Peripherals',
      unitPrice: 2499.00,
      currentStock: 2, // Low stock on purpose!
      minimumStock: 8,
      warehouseLocation: 'Shelf B-205',
    },
  });

  console.log('✅ Products seeded');

  // 4. Seed Stock Movements (only if none exist for p1)
  const existingMovements = await prisma.stockMovement.count();
  if (existingMovements === 0) {
    await prisma.stockMovement.createMany({
      data: [
        {
          productId: p1.id,
          quantity: 20,
          movementType: MovementType.IN,
          reason: 'Initial PO Purchase Receive',
          createdById: warehouseUser.id,
        },
        {
          productId: p2.id,
          quantity: 50,
          movementType: MovementType.IN,
          reason: 'Vendor Batch Receipt',
          createdById: warehouseUser.id,
        },
        {
          productId: p3.id,
          quantity: 5,
          movementType: MovementType.IN,
          reason: 'Initial Stock Receive',
          createdById: warehouseUser.id,
        },
        {
          productId: p4.id,
          quantity: 10,
          movementType: MovementType.IN,
          reason: 'Supplier Shipment',
          createdById: warehouseUser.id,
        },
      ],
    });
    console.log('✅ Stock movements seeded');
  }

  // 5. Seed Draft Challan & Confirmed Challan
  const existingChallans = await prisma.challan.count();
  if (existingChallans === 0) {
    await prisma.challan.create({
      data: {
        challanNumber: 'CH-00001',
        customerId: customer1.id,
        totalQuantity: 2,
        status: ChallanStatus.DRAFT,
        createdById: salesUser.id,
        items: {
          create: [
            {
              productId: p1.id,
              productNameSnapshot: p1.productName,
              skuSnapshot: p1.sku,
              unitPriceSnapshot: p1.unitPrice,
              quantity: 2,
            },
          ],
        },
      },
    });

    await prisma.challan.create({
      data: {
        challanNumber: 'CH-00002',
        customerId: customer3.id,
        totalQuantity: 5,
        status: ChallanStatus.CONFIRMED,
        createdById: salesUser.id,
        items: {
          create: [
            {
              productId: p2.id,
              productNameSnapshot: p2.productName,
              skuSnapshot: p2.sku,
              unitPriceSnapshot: p2.unitPrice,
              quantity: 5,
            },
          ],
        },
      },
    });
    console.log('✅ Sample Challans seeded: CH-00001 (Draft), CH-00002 (Confirmed)');
  }
  console.log('🎉 Seed process completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
