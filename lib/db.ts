import { PrismaClient } from "./generated/prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// 1. Prevent TypeScript errors on the global object
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Create a function to initialize the client with your Adapter
const createPrismaClient = () => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
};

// 3. Use the existing instance if we have one, otherwise create new
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 4. Save the instance to global in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;