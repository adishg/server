import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authMiddleware } from '../../lib/jwt.js';
export const formRouter = Router();
formRouter.get('/:slug', authMiddleware, async (req, res) => {
    const form = await prisma.form.findFirst({
        where: { slug: req.params.slug, isActive: true },
        include: { fields: { orderBy: { sortOrder: 'asc' } } }
    });
    if (!form)
        return res.status(404).json({ message: 'Form not found' });
    res.json(form);
});
formRouter.post('/:slug/submit', authMiddleware, async (req, res) => {
    const form = await prisma.form.findFirst({ where: { slug: req.params.slug, isActive: true }, include: { fields: true } });
    if (!form)
        return res.status(404).json({ message: 'Form not found' });
    const required = new Set(form.fields.filter(f => f.required).map(f => f.name));
    const answers = req.body?.answers ?? {};
    for (const r of required)
        if (!(r in answers))
            return res.status(400).json({ message: `Missing ${r}` });
    const saved = await prisma.formResponse.create({ data: { formId: form.id, userId: req.userId, answers } });
    res.json(saved);
});
