import { initDB } from '@/lib/db';

export async function GET() {
  const result = await initDB();
  return Response.json({
    success: result.success,
    message: result.message,
  }, { status: result.success ? 200 : 503 });
}
