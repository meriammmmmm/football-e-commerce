import { sql } from '@vercel/postgres';

// Initialize database tables
export async function initDB() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'received',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        copy TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('Database init error:', error);
  }
}

// User operations
export async function createUser(fullName: string, phone: string, address: string, email: string, passwordHash: string) {
  const id = `usr_${crypto.randomUUID().slice(0, 8)}`;
  await sql`
    INSERT INTO users (id, full_name, phone, address, email, password_hash)
    VALUES (${id}, ${fullName}, ${phone}, ${address}, ${email}, ${passwordHash})
  `;
  return { id, fullName, phone, address, email, createdAt: new Date().toISOString() };
}

export async function getUserByEmail(email: string) {
  const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return result.rows[0] || null;
}

// Order operations
export async function createOrder(email: string, items: any[], total: number) {
  const id = `HB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  await sql`
    INSERT INTO orders (id, email, items, total)
    VALUES (${id}, ${email}, ${JSON.stringify(items)}, ${total})
  `;
  return { id, email, items, total, status: 'received', createdAt: new Date().toISOString() };
}

export async function getOrdersByEmail(email: string) {
  const result = await sql`
    SELECT id, email, items, total, status, created_at
    FROM orders 
    WHERE email = ${email}
    ORDER BY created_at DESC
  `;
  return result.rows.map(row => ({
    id: row.id,
    email: row.email,
    items: row.items,
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at
  }));
}

// Review operations
export async function createReview(name: string, rating: number, copy: string) {
  const id = `review_${crypto.randomUUID().slice(0, 8)}`;
  await sql`
    INSERT INTO reviews (id, name, rating, copy)
    VALUES (${id}, ${name}, ${rating}, ${copy})
  `;
  return { id, name, rating, copy, createdAt: new Date().toISOString() };
}

export async function getAllReviews() {
  const result = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;
  return result.rows;
}
