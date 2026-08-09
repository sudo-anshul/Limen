import { PrismaClient } from '@prisma/client';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('No DATABASE_URL found, skipping permission check.');
    return;
  }

  console.log('Executing PostgreSQL schema permission setup...');
  const prisma = new PrismaClient();

  try {
    // Attempt 1: Grant all on schema public to current database user
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO CURRENT_USER;`);
    await prisma.$executeRawUnsafe(`GRANT CREATE ON SCHEMA public TO CURRENT_USER;`);
    console.log('Granted CREATE and ALL privileges on schema public.');
  } catch (err1) {
    console.warn('Grant on public schema warning:', err1);
    try {
      // Attempt 2: Alter schema public owner to current database user
      await prisma.$executeRawUnsafe(`ALTER SCHEMA public OWNER TO CURRENT_USER;`);
      console.log('Altered schema public owner to current user.');
    } catch (err2) {
      console.warn('Alter schema owner warning:', err2);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.warn('Prepush initialization warning:', e);
  process.exit(0);
});
