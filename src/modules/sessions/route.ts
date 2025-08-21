import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../../lib/jwt.js';
import { prisma } from '../../lib/prisma.js';

export const sessionRouter = Router();

sessionRouter.post('/start', authMiddleware as any, async (req: any, res) => {
  const { meditationId, moodBefore } = z.object({
    meditationId: z.string().min(1),
    moodBefore: z.string().optional()
  }).parse(req.body);
  const s = await prisma.session.create({ data: { userId: req.userId, meditationId, moodBefore } });
  res.json(s);
});

sessionRouter.post('/end', authMiddleware as any, async (req: any, res) => {
  const { sessionId, rating, moodAfter, durationSec, notes } = z.object({
    sessionId: z.string().min(1),
    rating: z.number().min(1).max(5).optional(),
    moodAfter: z.string().optional(),
    durationSec: z.number().int().positive().optional(),
    notes: z.string().max(1000).optional()
  }).parse(req.body);
  const s = await prisma.session.update({
    where: { id: sessionId },
    data: { endedAt: new Date(), rating, moodAfter, durationSec, notes }
  });
  res.json(s);
});
