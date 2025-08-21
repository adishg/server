import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authOptional } from '../../lib/jwt.js';

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
