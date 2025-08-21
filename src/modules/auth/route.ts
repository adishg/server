import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { signAccess, signRefresh, authMiddleware } from '../../lib/jwt';

export const authRouter = Router();

const registerZ = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

authRouter.post('/register', async (req, res) => {
  const data = registerZ.parse(req.body);
  const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (exists) return res.status(409).json({ message: 'Email in use' });
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: await bcrypt.hash(data.password, 10),
      name: data.name
    }
  });
  res.json({
    accessToken: signAccess(user.id),
    refreshToken: signRefresh(user.id),
    user: { id: user.id, email: user.email, name: user.name }
  });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  res.json({
    accessToken: signAccess(user.id),
    refreshToken: signRefresh(user.id),
    user: { id: user.id, email: user.email, name: user.name }
  });
});

authRouter.get('/me', authMiddleware as any, async (req: any, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ user: user ? { id: user.id, email: user.email, name: user.name } : null });
});
