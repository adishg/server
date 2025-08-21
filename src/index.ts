import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { authRouter } from './modules/auth/route';
import { meditationRouter } from './modules/meditations/route';
import { sessionRouter } from './modules/sessions/route';
import { formRouter } from './modules/forms/route';
import { subRouter } from './modules/subscriptions/route';
import { webhookRouter } from './modules/webhooks/route';

const app = express();
app.use(helmet());
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.use('/auth', authRouter);
app.use('/meditations', meditationRouter);
app.use('/sessions', sessionRouter);
app.use('/forms', formRouter);
app.use('/subscriptions', subRouter);
app.use('/webhooks', webhookRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
