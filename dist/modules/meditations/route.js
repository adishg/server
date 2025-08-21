import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authOptional } from '../../lib/jwt.js';
export const meditationRouter = Router();
meditationRouter.get('/', authOptional, async (req, res) => {
    const userId = req.userId;
    const items = await prisma.meditation.findMany({ orderBy: { createdAt: 'desc' } });
    let hasActive = false;
    if (userId) {
        hasActive = !!(await prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE', currentPeriodEnd: { gt: new Date() } }
        }));
    }
    res.json(items.map(m => ({ ...m, locked: m.isPremium && !hasActive })));
});
