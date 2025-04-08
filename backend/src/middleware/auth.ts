import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie'; 

export const authMiddleware = async (c:any, next:any) => {
  const jwtToken = getCookie(c, 'jwt'); // Retrieve JWT from cookies

  if (!jwtToken) {
    console.log('JWT token not found in cookies');
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verify(jwtToken, 'secret'); // Verify token
    if (!payload || !payload.id) {
      console.log('Invalid or missing payload');
      return c.json({ message: 'Invalid token' }, 401);
    }
    c.set('userId', payload.id); // Set user ID for further use
    await next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return c.json({ message: 'Invalid token' }, 401);
  }
};
