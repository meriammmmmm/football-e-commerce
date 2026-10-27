import { getRequestAdminIdentity } from '@/lib/adminGuard';
import { ensureTables, getDb, isDatabaseConfigured } from '@/lib/db';

export interface CustomerSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
}

/**
 * GET /api/admin/customers
 * Returns every registered user that has at least one order,
 * with aggregate spend and order count.
 */
export async function GET() {
  const identity = await getRequestAdminIdentity();
  if (!identity) {
    return Response.json({ error: 'Admin access required.' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return Response.json({ customers: [] });
  }

  try {
    await ensureTables();
    const db = getDb();

    const result = await db.query(`
      SELECT
        u.id,
        u.full_name   AS "fullName",
        u.email,
        u.phone,
        u.address,
        u.created_at  AS "createdAt",
        COUNT(o.id)::int          AS "orderCount",
        COALESCE(SUM(o.total), 0) AS "totalSpent",
        MAX(o.created_at)         AS "lastOrderAt"
      FROM users u
      INNER JOIN orders o ON o.email = u.email
      GROUP BY u.id, u.full_name, u.email, u.phone, u.address, u.created_at
      ORDER BY MAX(o.created_at) DESC
    `);

    const customers: CustomerSummary[] = result.rows.map((row) => ({
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      address: row.address,
      createdAt: new Date(row.createdAt).toISOString(),
      orderCount: row.orderCount,
      totalSpent: Number(row.totalSpent),
      lastOrderAt: row.lastOrderAt ? new Date(row.lastOrderAt).toISOString() : null,
    }));

    return Response.json({ customers });
  } catch (error) {
    console.error('Customers query failed:', error);
    return Response.json({ error: 'Could not load customers.' }, { status: 503 });
  }
}
