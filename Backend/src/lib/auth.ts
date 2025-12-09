import "dotenv/config"
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }) 
const prisma=new PrismaClient({adapter});
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
   socialProviders:{
    "google":{ 
        prompt: "select_account",
        clientId:process.env.CLIENT_ID! , 
        clientSecret : process.env.CLIENT_SECRET!,  
        redirectURI:"http://localhost:8000/api/auth/callback/google"
    }
   }, 
  // optionally add trusted origins for CORS
  trustedOrigins: ['http://localhost:3000'],
});
