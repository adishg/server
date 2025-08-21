import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { authOptional } from '../../lib/jwt';

export const meditationRouter = Router();

meditationRouter.get('/', authOptional as any, async (req: any, res) => {
  const userId = req.userId as string | undefined;
  const items = await prisma.meditation.findMany({ orderBy: { createdAt: 'desc' } });
  let hasActive = false;
  if (userId) {
    hasActive = !!(await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE', currentPeriodEnd: { gt: new Date() } }
    }));
  }
  res.json(items.map(m => ({ ...m, locked: m.isPremium && !hasActive })));
});
