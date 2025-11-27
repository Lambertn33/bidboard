// prisma/prisma.ts  (for seed.ts etc.)
import { PrismaClient } from '../generated/prisma/client';
import { createMariaDbAdapter } from './adapter';

const prisma = new PrismaClient({ adapter: createMariaDbAdapter() });

export default prisma;
