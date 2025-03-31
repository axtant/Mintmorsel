import { verify } from 'hono/jwt';

export const authMiddleware = async (c:any , next:any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = await verify(token, 'secret');
    if (!payload || !payload.id) {
      return c.json({ message: 'Invalid token' }, 401);
    }
    c.set('userId', payload.id);
    await next();
  } catch (e) {
    return c.json({ message: 'Invalid token' }, 401);
  }
};
