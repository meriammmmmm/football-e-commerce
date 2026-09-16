import { Pool } from 'pg';

// Get database connection string from environment
function getConnectionString() {
  return process.env.POSTGRES_URL || 
         process.env.STORAGE_URL || 
         process.env.DATABASE_URL ||
         process.env.POSTGRES_URL_NON_POOLING;
}

// Check if database is configured
function isDatabaseConfigured() {
  return !!getConnectionString();
}

// Create database pool
let pool: Pool | null = null;
function getDb() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error('No database connection string found');
  }
  if (!pool) {
    pool = new Pool({ connectionString, max: 10 });
  }
  return pool;
}

// Initialize database tables
export async function initDB() {
  if (!isDatabaseConfigured()) {
    console.log('⚠️ Database not configured, using in-memory storage');
    return { success: false, message: 'Database not configured' };
  }
  
  try {
    const db = getDb();
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        items JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'received',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create reviews table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        copy TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database initialized');
    return { success: true, message: 'Database initialized' };
  } catch (error) {
    console.error('Database init error:', error);
    throw error;
  }
}

// User operations
export async function createUser(fullName: string, phone: string, address: string, email: string, passwordHash: string) {
  const db = getDb();
  const id = `usr_${crypto.randomUUID().slice(0, 8)}`;
  await db.query(
    'INSERT INTO users (id, full_name, phone, address, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, fullName, phone, address, email, passwordHash]
  );
  return { id, fullName, phone, address, email, createdAt: new Date().toISOString() };
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  const result = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return result.rows[0] || null;
}

// Order operations
export async function createOrder(email: string, items: any[], total: number) {
  const db = getDb();
  const id = `HB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  await db.query(
    'INSERT INTO orders (id, email, items, total) VALUES ($1, $2, $3, $4)',
    [id, email, JSON.stringify(items), total]
  );
  return { id, email, items, total, status: 'received' as const, createdAt: new Date().toISOString() };
}

export async function getOrdersByEmail(email: string) {
  const db = getDb();
  const result = await db.query(
    'SELECT id, email, items, total, status, created_at FROM orders WHERE email = $1 ORDER BY created_at DESC',
    [email]
  );
  return result.rows.map(row => ({
    id: row.id,
    email: row.email,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at
  }));
}

// Review operations
export async function createReview(name: string, rating: number, copy: string) {
  const db = getDb();
  const id = `review_${crypto.randomUUID().slice(0, 8)}`;
  await db.query(
    'INSERT INTO reviews (id, name, rating, copy) VALUES ($1, $2, $3, $4)',
    [id, name, rating, copy]
  );
  return { id, name, rating, copy, createdAt: new Date().toISOString() };
}

export async function getAllReviews() {
  const db = getDb();
  const result = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
  return result.rows;
}
