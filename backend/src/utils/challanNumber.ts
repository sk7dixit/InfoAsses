import { prisma } from '../config/database';

export const generateNextChallanNumber = async (): Promise<string> => {
  const lastChallan = await prisma.challan.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { challanNumber: true },
  });

  if (!lastChallan || !lastChallan.challanNumber.startsWith('CH-')) {
    return 'CH-00001';
  }

  const numberPart = parseInt(lastChallan.challanNumber.replace('CH-', ''), 10);
  if (isNaN(numberPart)) {
    return 'CH-00001';
  }

  const nextNumber = numberPart + 1;
  return `CH-${nextNumber.toString().padStart(5, '0')}`;
};
