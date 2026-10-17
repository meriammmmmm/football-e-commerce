import { initDB, isDatabaseConfigured } from '@/lib/db';

export async function GET() {
  const database = await initDB();

  return Response.json({
    ok: true,
    backend: database.success ? 'database' : 'fallback',
    databaseConfigured: isDatabaseConfigured(),
    message: database.message,
    timestamp: new Date().toISOString(),
  }, { status: 200 });
}
