import {Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string

	}
}>();

app.post('/api/v1/signup',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try{
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        address: body.address,
        pin: body.pin,
        gMapLink: body.gMapLink
      }
    });
    return c.json(user)
  }catch(e){
    if(e instanceof Error){
      return c.json({message: e.message}, 400)
    }

  }
  
});


app.post('/api/v1/signin',async (c) => {
   const prisma = new PrismaClient({
     datasourceUrl: c.env.DATABASE_URL,
   }).$extends(withAccelerate());

   const body = await c.req.json();
   const user = await prisma.user.findUnique({
     where: {
       username: body.username,
       password: body.password
     }
   });

   if (!user) {
     return c.json({ message: 'Invalid credentials' }, 401);
   }
   const jwt = await sign({id: user.id}, 'secret')
   return c.json({jwt})
})

export default app
