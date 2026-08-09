import { PrismaClient } from '@prisma/client';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('No DATABASE_URL set, skipping schema permission setup.');
    return;
  }

  console.log('Ensuring PostgreSQL schema permissions...');
  const prisma = new PrismaClient();

  try {
    // Ensure custom schema exists and has full permissions
    await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS limen;`);
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA limen TO CURRENT_USER;`);
    console.log('Successfully prepared schema "limen" on PostgreSQL.');
  } catch (err) {
    // If schema creation fails, try granting on public
    try {
      await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO CURRENT_USER;`);
      console.log('Granted permissions on schema "public".');
    } catch (fallbackErr) {
      console.warn('Pre-push permission check warning:', err, fallbackErr);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.warn('Pre-push script non-fatal warning:', e);
  process.exit(0);
});
