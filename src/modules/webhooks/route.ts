import { Router } from 'express';
export const webhookRouter = Router();
webhookRouter.post('/razorpay', async (_req, res) => {
  // TODO: verify signature and activate subscription
  res.json({ ok: true });
});
