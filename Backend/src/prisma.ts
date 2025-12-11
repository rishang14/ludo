
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"; 
import "dotenv/config"

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })
export default prisma;

