import { initDB } from '@/lib/db';

export async function GET() {
  try {
    // Check what env vars are available
    const envVars = Object.keys(process.env).filter(key => 
      key.includes('POSTGRES') || 
      key.includes('DATABASE') || 
      key.includes('STORAGE') ||
      key.includes('SUPABASE')
    );
    
    const result = await initDB();
    return Response.json({ 
      success: true, 
      message: 'Database initialized',
      result,
      availableEnvVars: envVars,
      hasConnection: !!process.env.POSTGRES_URL || !!process.env.STORAGE_URL || !!process.env.DATABASE_URL
    });
  } catch (error) {
    const envVars = Object.keys(process.env).filter(key => 
      key.includes('POSTGRES') || 
      key.includes('DATABASE') || 
      key.includes('STORAGE') ||
      key.includes('SUPABASE')
    );
    return Response.json({ 
      success: false, 
      error: String(error),
      message: error instanceof Error ? error.message : 'Unknown error',
      availableEnvVars: envVars
    }, { status: 500 });
  }
}
