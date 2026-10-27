export const dynamic = 'force-dynamic';
import { getRequestAdminIdentity } from '@/lib/adminGuard';
import { ensureTables, getDb, isDatabaseConfigured } from '@/lib/db';
import type { CustomerSummary } from '@/app/api/admin/customers/route';
import CustomersPanel from '@/components/admin/CustomersPanel';

async function getCustomers(): Promise<CustomerSummary[]> {
  if (!isDatabaseConfigured()) return [];
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
    return result.rows.map((row) => ({
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
  } catch {
    return [];
  }
}

export default async function CustomersPage() {
  const identity = await getRequestAdminIdentity();
  if (!identity) return null;

  const customers = await getCustomers();

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300/80">Customers</p>
        <h1 className="mt-1 text-2xl font-black">Users with orders</h1>
        <p className="mt-1 text-sm font-medium text-white/45">
          {customers.length} customer{customers.length !== 1 ? 's' : ''} found
        </p>
      </header>

      <CustomersPanel initialCustomers={customers} />
    </div>
  );
}
