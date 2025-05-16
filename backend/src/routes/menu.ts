import { Hono } from 'hono';
import { createPrismaClient } from '../config/prisma';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { authMiddleware } from '../middleware/auth';

const menuRouter = new Hono<{
  Bindings: {
    DATABASE_URL:string,
  }
  Variables: {
    userId: string;
  };
}>();

menuRouter.post('/post',  async (c) => {
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
  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const category = c.req.query('category'); // Get category from query params
    const whereCondition = category && category !== 'All' ? { category } : {}; // Apply filter

    const menu = await prisma.menu.findMany({
      where: whereCondition,
      select: {
        category: true,
        itemName: true,
        itemDesc: true,
        price: true,
      },
    });

    return c.json(menu);
  } catch (e) {
    return c.json({ message: e }, 400);
  }
});

menuRouter.delete('/delete', async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  try {
    await prisma.menu.deleteMany();
    return c.json({ message: 'All menu items deleted successfully' }, 200);
  } catch (e) {
    return c.json({ message: e }, 400);
  }
})

menuRouter.put('/update-desc', async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  const body = await c.req.json();

  const fixedId = '96c88047-4d6c-4bcd-8888-b701e93fb93b';

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: fixedId },
      data: {
        itemDesc: body.itemDesc,
      },
    });

    return c.json(updatedMenu);
  } catch (e) {
    return c.json({ message: e }, 400);
  }
});


export default menuRouter;
