import { Router } from 'express';
import { z } from 'zod';
import Razorpay from 'razorpay';
import { prisma } from '../../lib/prisma';
import { authMiddleware } from '../../lib/jwt';

export const subRouter = Router();

const rz = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

subRouter.post('/create-order', authMiddleware as any, async (req: any, res) => {
  const { amountInr, plan } = z.object({ amountInr: z.number().int().positive(), plan: z.string() }).parse(req.body);
  const order = await rz.orders.create({ amount: amountInr * 100, currency: 'INR', receipt: `user_${req.userId}_${Date.now()}` });
  await prisma.purchase.create({
    data: { userId: req.userId, amountCents: amountInr * 100, currency: 'INR', status: 'created', provider: 'razorpay', providerOrderId: order.id }
  });
  res.json({ orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID, plan });
});
