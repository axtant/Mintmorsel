import { Hono } from 'hono';
import { createPrismaClient } from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'hono/cookie';

const authRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
  }
}>();

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Signup route
authRouter.post('/signup', async (c) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);
  const { username, password, address, pin, gMapLink } = await c.req.json();

  if (!username || !password || !address || !pin || !gMapLink) {
    return c.json({ message: 'Missing required fields' }, 400);
  }

  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return c.json({ message: 'Username already taken' }, 400);
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        address,
        pin: BigInt(pin),
        gMapLink,
      },
    });

    return c.json({
      id: user.id,
      username: user.username,
      address: user.address,
      pin: user.pin.toString(),
      gMapLink: user.gMapLink,
    });
  } catch (e: any) {
    console.error(e);
    if (e.code === 'P2002') {
      return c.json({ message: 'Username already taken' }, 400);
    }
    return c.json({ message: e.message || 'Internal Server Error' }, 500);
  }
});

// Signin route
authRouter.post('/signin', async (c) => {
  const { username, password } = await c.req.json();
  const prisma = createPrismaClient(c.env.DATABASE_URL);

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await comparePasswords(password, user.password))) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  const jwtToken = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });

  setCookie(c, 'jwt', jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 3600,
    path: '/',
  });

  return c.json({
    id: user.id,
    username: user.username,
    address: user.address,
    pin: user.pin.toString(),
    gMapLink: user.gMapLink,
  });
});

// Logout route
authRouter.post('/logout', async (c) => {
  setCookie(c, 'jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 0,
    path: '/',
  });
  return c.json({ message: 'Logout successful' });
});

// Authentication middleware
export const authMiddleware = async (c: any, next: any) => {
  const jwtToken = c.req.cookie('jwt');

  if (!jwtToken) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const payload = jwt.verify(jwtToken, 'secret');
    if (typeof payload === 'string' || !('id' in payload)) {
      return c.json({ message: 'Invalid token' }, 401);
    }

    c.set('userId', payload.id);
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid token' }, 401);
  }
};

export default authRouter;
