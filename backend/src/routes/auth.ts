import { Hono } from 'hono';
import { createPrismaClient } from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { setCookie } from 'hono/cookie';
import { getCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';

const authRouter = new Hono<{
  Bindings: {
    DATABASE_URL:string,
  }
}>();

// Helper functions
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

// Signin route
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

  // Generate JWT token
  const jwtToken = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });

  // Set HttpOnly cookie for JWT
  setCookie(c, 'jwt', jwtToken, {
    httpOnly: true, // Prevent access via JavaScript
    secure: true, // Set to true in production with HTTPS
    sameSite: 'None', // Allow cross-origin requests
    maxAge: 3600, // Expire in 1 hour
    path: '/', // Cookie applies to all routes
  });

  // Return user data excluding sensitive information
  const userData = {
    id: user.id,
    username: user.username,
    address: user.address,
    pin: user.pin,
    gMapLink: user.gMapLink,
  };

  return c.json(userData);
});


// Logout route
authRouter.post('/logout', async (c) => {
  setCookie(c, 'jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 0, // Expire immediately
    path: '/',
  });
  return c.json({ message: 'Logout successful' });
});

// Authentication middleware
export const authMiddleware = async (c: any, next: any) => {
  const jwtToken = c.req.cookie('jwt'); // Retrieve JWT from cookies

  if (!jwtToken) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const payload = jwt.verify(jwtToken, 'secret'); // Verify token

    // Type guard to ensure payload is JwtPayload
    if (typeof payload === 'string' || !('id' in payload)) {
      return c.json({ message: 'Invalid token' }, 401);
    }

    // Now TypeScript knows payload is JwtPayload and has an 'id' property
    c.set('userId', payload.id); // Set user ID for further use
    await next();
  } catch (error) {
    return c.json({ message: 'Invalid token' }, 401);
  }
};

export default authRouter;
