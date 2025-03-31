import { Hono } from 'hono';
import authRouter from './routes/auth';
import menuRouter from './routes/menu';

const app = new Hono();

app.route('/api/v1/auth', authRouter);
app.route('/api/v1/menu', menuRouter);

export default app;
