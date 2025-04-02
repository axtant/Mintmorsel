import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { createPrismaClient } from '../config/prisma';

const authRouter = new Hono<{
  Bindings: {
    DATABASE_URL:string,
  }
}>();
authRouter.post('/signup', async (c) => {

  const prisma = createPrismaClient(c.env.DATABASE_URL);

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        address: body.address,  
        pin: body.pin,
        gMapLink: body.gMapLink,
      },
    });
    return c.json(user);
  } catch (e) {
    return c.json({ message: e }, 400);
  }
});

authRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
      password: body.password, 
    },
  });

  if (!user) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }
  const jwt = await sign({ id: user.id }, 'secret');
  return c.json({ jwt });
});

export default authRouter;
