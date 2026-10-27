import { getRequestAdminIdentity } from '@/lib/adminGuard';
import { ensureTables, getDb, isDatabaseConfigured } from '@/lib/db';

/**
 * GET /api/admin/customers/[id]
 * Returns all orders for a specific user (matched by their user id).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const identity = await getRequestAdminIdentity();
  if (!identity) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return Response.json({ orders: [] });
  }

  try {
    await ensureTables();
    const db = getDb();

    // Resolve the email for this user id first
    const userResult = await db.query(
      'SELECT email, full_name FROM users WHERE id = $1 LIMIT 1',
      [id],
    );
    const user = userResult.rows[0];
    if (!user) {
      return Response.json({ error: 'User not found.' }, { status: 404 });
    }

    const ordersResult = await db.query(
      `SELECT id, email, items, total, status, created_at
       FROM orders WHERE email = $1 ORDER BY created_at DESC`,
      [user.email],
    );

    const orders = ordersResult.rows.map((row) => ({
      id: row.id,
      email: row.email,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      total: Number(row.total),
      status: row.status as string,
      createdAt: new Date(row.created_at).toISOString(),
    }));

    return Response.json({ orders, email: user.email, fullName: user.full_name });
  } catch (error) {
    console.error('Customer orders query failed:', error);
    return Response.json({ error: 'Could not load orders.' }, { status: 503 });
  }
}
