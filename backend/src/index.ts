import { Hono } from 'hono';
import authRouter from './routes/auth';
import menuRouter from './routes/menu';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies
    allowMethods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
    allowHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  })
);

app.route('/api/v1/auth', authRouter);
app.route('/api/v1/menu', menuRouter);

export default app;
