import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { createPrismaClient } from '../config/prisma';
import { B } from '@angular/cdk/keycodes';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const menuRouter = new Hono<{
  Bindings: {
    DATABASE_URL:string,
  }
}>();

menuRouter.post('/', async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  const body = await c.req.json();
  try {
    const menu = await prisma.menu.create({
      data: {
        category: body.category,
        itemName: body.itemName,
        itemDesc: body.itemDesc,
        price: parseFloat(body.price),
      },
    });
    return c.json(menu);
  } catch (e) {
    return c.json({ message: e }, 400);
  }
});

menuRouter.get('/',  async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const menu = await prisma.menu.findMany();
    return c.json(menu);
  } catch (e) {
    return c.json({ message: e }, 400);
  }
});

export default menuRouter;
