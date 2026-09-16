import { createUser, getUserByEmail } from '@/lib/db';
import { authenticateDemoUser, registerDemoUser } from '@/lib/demoStore';
import { createHash } from 'crypto';

const hashPassword = (password: string) => createHash('sha256').update(password).digest('hex');

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email) || typeof body.password !== 'string') return Response.json({ error: 'Enter a valid email address and password.' }, { status: 400 });

  const email = body.email.trim().toLowerCase();

  if (body.action === 'register') {
    if (typeof body.fullName !== 'string' || body.fullName.trim().length < 2 || typeof body.phone !== 'string' || body.phone.trim().length < 6 || typeof body.address !== 'string' || body.address.trim().length < 5) return Response.json({ error: 'Complete your full name, phone number, and address.' }, { status: 400 });
    if (body.password.length < 8) return Response.json({ error: 'Use a password of at least 8 characters.' }, { status: 400 });
    
    try {
      // Try database first
      const existing = await getUserByEmail(email);
      if (existing) return Response.json({ error: 'An account already exists for this email. Sign in instead.' }, { status: 409 });
      
      const user = await createUser(body.fullName, body.phone, body.address, email, hashPassword(body.password));
      return Response.json({ user }, { status: 201 });
    } catch (dbError) {
      // Fallback to in-memory store
      console.log('Database unavailable, using in-memory store');
      try {
        const user = registerDemoUser({ fullName: body.fullName, phone: body.phone, address: body.address, email, password: body.password });
        return Response.json({ user }, { status: 201 });
      } catch (error) {
        return Response.json({ error: error instanceof Error ? error.message : 'Could not create this account.' }, { status: 409 });
      }
    }
  }

  try {
    // Try database first
    const user = await getUserByEmail(email);
    if (!user || user.password_hash !== hashPassword(body.password)) {
      throw new Error('Invalid credentials');
    }
    
    return Response.json({ 
      user: {
        id: user.id,
        fullName: user.full_name,
        phone: user.phone,
        address: user.address,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (dbError) {
    // Fallback to in-memory store
    console.log('Database unavailable, using in-memory store');
    const user = authenticateDemoUser(email, body.password);
    if (!user) {
      return Response.json({ error: 'Incorrect email or password. Create an account if you are new here.' }, { status: 401 });
    }
    return Response.json({ user });
  }
}
