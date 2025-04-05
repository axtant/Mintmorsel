import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { createPrismaClient } from '../config/prisma';
import bcrypt from 'bcryptjs';

const authRouter = new Hono<{
  Bindings: {
    DATABASE_URL:string,
  }
}>();

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

authRouter.post('/signup', async (c) => {

  const prisma = createPrismaClient(c.env.DATABASE_URL);

  const body = await c.req.json();
  try {
    const hashedPassword = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: hashedPassword,
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

  // Find user by username
  const user = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (!user) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  // Compare provided password with stored hashed password
  const isValidPassword = await comparePasswords(body.password, user.password);

  if (!isValidPassword) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  // Generate JWT and return user data
  const jwt = await sign({ id: user.id }, 'secret');
  // Return user data excluding password for security
  const userData = {
    id: user.id,
    username: user.username,
    address: user.address,
    pin: user.pin,
    gMapLink: user.gMapLink,
    jwt,
  };

  return c.json(userData);
});

export default authRouter;
