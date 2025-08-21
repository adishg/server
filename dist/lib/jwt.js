// @ts-ignore
import jwt from 'jsonwebtoken';
import { env } from '../env.js';
export function signAccess(userId) {
    return jwt.sign({ sub: userId, typ: 'access' }, env.JWT_SECRET, { expiresIn: '15m' });
}
export function signRefresh(userId) {
    return jwt.sign({ sub: userId, typ: 'refresh' }, env.JWT_SECRET, { expiresIn: '30d' });
}
export function authMiddleware(req, res, next) {
    const h = req.headers.authorization;
    if (!h)
        return res.status(401).json({ message: 'No auth header' });
    const token = h.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.userId = payload.sub;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
export function authOptional(req, _res, next) {
    const h = req.headers.authorization;
    if (h) {
        try {
            const token = h.replace('Bearer ', '');
            const payload = jwt.verify(token, env.JWT_SECRET);
            req.userId = payload.sub;
        }
        catch { }
    }
    next();
}
