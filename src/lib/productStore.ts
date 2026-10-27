import { ensureTables, getDb, isDatabaseConfigured } from '@/lib/db';
import bundledCatalog from '@/lib/headbuttProducts.json';
import type { Product } from '@/types';

export type ImageSlot = 'front' | 'back';

export interface ProductInput {
  name: string;
  team: string;
  price: number;
  league?: string;
  player?: string;
  number?: string;
  sleeveType?: 'short' | 'long';
  category?: string;
  description?: string;
  rating?: number;
  reviews_count?: number;
  sizes: string[];
  colors: string[];
  available: boolean;
  is_new: boolean;
  is_featured: boolean;
}

export interface ProductInputResult {
  ok: boolean;
  error?: string;
  value?: ProductInput;
}

const CATALOG_SEED_KEY = 'catalog_seeded';
const FALLBACK_IMAGE = '/headbutt-logo.jpg';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** The bundled catalogue only carries a subset of the product fields. */
type BundledProduct = Partial<Product> & Pick<Product, 'id' | 'name' | 'team' | 'price' | 'image_url'>;

const catalog = bundledCatalog as unknown as BundledProduct[];

interface ProductRow {
  id: string;
  name: string;
  league: string | null;
  team: string;
  player: string | null;
  number: string | null;
  price: string | number;
  sleeve_type: string | null;
  category: string | null;
  rating: number | string;
  reviews_count: number | string;
  image_url: string | null;
  hover_image_url: string | null;
  description: string | null;
  sizes: unknown;
  colors: unknown;
  available: boolean;
  is_new: boolean;
  is_featured: boolean;
  position: number;
  created_at: string | Date;
  updated_at: string | Date;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function rowToProduct(row: ProductRow): Product {
  const available = row.available !== false;
  return {
    id: row.id,
    name: row.name,
    league: row.league ?? undefined,
    team: row.team,
    player: row.player ?? undefined,
    number: row.number ?? undefined,
    price: Number(row.price ?? 0),
    sleeveType: row.sleeve_type === 'long' ? 'long' : row.sleeve_type === 'short' ? 'short' : undefined,
    category: row.category ?? undefined,
    rating: Number(row.rating ?? 0),
    reviews_count: Number(row.reviews_count ?? 0),
    image_url: row.image_url || FALLBACK_IMAGE,
    hover_image_url: row.hover_image_url ?? undefined,
    description: row.description ?? undefined,
    sizes: toStringArray(row.sizes),
    colors: toStringArray(row.colors),
    available,
    inStock: available,
    is_new: Boolean(row.is_new),
    is_featured: Boolean(row.is_featured),
  };
}

/** The catalogue bundled in the repository. Used until the database has products. */
export function bundledProducts(): Product[] {
  return catalog.map((product) => {
    const available = product.available ?? product.inStock ?? true;
    return {
      id: product.id,
      name: product.name,
      league: product.league,
      team: product.team,
      player: product.player,
      number: product.number,
      price: product.price,
      sleeveType: product.sleeveType,
      category: product.category,
      rating: product.rating ?? 0,
      reviews_count: product.reviews_count ?? 0,
      image_url: product.image_url || FALLBACK_IMAGE,
      hover_image_url: product.hover_image_url,
      description: product.description,
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
      available,
      inStock: available,
      is_new: Boolean(product.is_new),
      is_featured: Boolean(product.is_featured),
    };
  });
}

/**
 * Copies the bundled catalogue into the database the first time the products
 * table is used, so the storefront keeps showing the same shirts. The marker in
 * app_settings stops deleted products from coming back on the next request.
 */
async function seedBundledCatalogOnce() {
  const db = getDb();
  const marker = await db.query('SELECT value FROM app_settings WHERE key = $1', [CATALOG_SEED_KEY]);
  if (marker.rows.length > 0) return;

  const existing = await db.query('SELECT COUNT(*)::int AS count FROM products');
  if (Number(existing.rows[0]?.count ?? 0) === 0) {
    for (const [index, product] of catalog.entries()) {
      await db.query(
        `INSERT INTO products (
           id, name, league, team, player, "number", price, sleeve_type, category,
           rating, reviews_count, image_url, hover_image_url, description,
           sizes, colors, available, is_new, is_featured, position
         ) VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9,
           $10, $11, $12, $13, $14,
           $15::jsonb, $16::jsonb, $17, $18, $19, $20
         )
         ON CONFLICT (id) DO NOTHING`,
        [
          product.id,
          product.name,
          product.league ?? null,
          product.team,
          product.player ?? null,
          product.number ?? null,
          product.price ?? 0,
          product.sleeveType ?? null,
          product.category ?? null,
          product.rating ?? 0,
          product.reviews_count ?? 0,
          product.image_url ?? null,
          product.hover_image_url ?? null,
          product.description ?? null,
          JSON.stringify(product.sizes ?? []),
          JSON.stringify(product.colors ?? []),
          product.available ?? product.inStock ?? true,
          Boolean(product.is_new),
          Boolean(product.is_featured),
          index + 1,
        ],
      );
    }
  }

  await db.query(
    `INSERT INTO app_settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [CATALOG_SEED_KEY, new Date().toISOString()],
  );
}

/** All products, newest admin additions first. Falls back to the bundled catalogue. */
export async function listProducts(): Promise<Product[]> {
  if (!isDatabaseConfigured()) return bundledProducts();

  try {
    await ensureTables();
    await seedBundledCatalogOnce();
    const db = getDb();
    const result = await db.query(
      'SELECT * FROM products ORDER BY position ASC, created_at DESC, id DESC',
    );
    const products = result.rows.map(rowToProduct);
    return products.length > 0 ? products : bundledProducts();
  } catch (error) {
    console.error('Product read failed; using the bundled catalogue:', error);
    return bundledProducts();
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isDatabaseConfigured()) {
    return bundledProducts().find((product) => product.id === id) ?? null;
  }

  try {
    await ensureTables();
    const db = getDb();
    const result = await db.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0] ? rowToProduct(result.rows[0]) : null;
  } catch (error) {
    console.error('Product read failed; using the bundled catalogue:', error);
    return bundledProducts().find((product) => product.id === id) ?? null;
  }
}

export async function createProduct(input: ProductInput): Promise<Product> {
  await ensureTables();
  const db = getDb();
  const id = `hb-${crypto.randomUUID().slice(0, 8)}`;

  await db.query(
    `INSERT INTO products (
       id, name, league, team, player, "number", price, sleeve_type, category,
       rating, reviews_count, description, sizes, colors,
       available, is_new, is_featured, position
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9,
       $10, $11, $12, $13::jsonb, $14::jsonb,
       $15, $16, $17, 0
     )`,
    [
      id,
      input.name,
      input.league ?? null,
      input.team,
      input.player ?? null,
      input.number ?? null,
      input.price,
      input.sleeveType ?? null,
      input.category ?? null,
      input.rating ?? 0,
      input.reviews_count ?? 0,
      input.description ?? null,
      JSON.stringify(input.sizes),
      JSON.stringify(input.colors),
      input.available,
      input.is_new,
      input.is_featured,
    ],
  );

  const created = await getProductById(id);
  if (!created) throw new Error('The product was saved but could not be read back.');
  return created;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product | null> {
  await ensureTables();
  const db = getDb();
  const updated = await db.query(
    `UPDATE products SET
       name = $2, league = $3, team = $4, player = $5, "number" = $6,
       price = $7, sleeve_type = $8, category = $9, rating = $10,
       reviews_count = $11, description = $12, sizes = $13::jsonb, colors = $14::jsonb,
       available = $15, is_new = $16, is_featured = $17, updated_at = NOW()
     WHERE id = $1
     RETURNING id`,
    [
      id,
      input.name,
      input.league ?? null,
      input.team,
      input.player ?? null,
      input.number ?? null,
      input.price,
      input.sleeveType ?? null,
      input.category ?? null,
      input.rating ?? 0,
      input.reviews_count ?? 0,
      input.description ?? null,
      JSON.stringify(input.sizes),
      JSON.stringify(input.colors),
      input.available,
      input.is_new,
      input.is_featured,
    ],
  );

  if (updated.rows.length === 0) return null;
  return getProductById(id);
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureTables();
  const db = getDb();
  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  return result.rows.length > 0;
}

/**
 * Public URL of a product photo. The version is a path segment and never a
 * query string, because the Next.js image optimizer rejects local URLs that
 * carry one. "v" keeps the version from colliding with the "back" segment.
 */
export function productImageUrl(productId: string, slot: ImageSlot, version?: number): string {
  const base = `/api/products/${productId}/image`;
  if (!version) return slot === 'back' ? `${base}/back` : base;
  return slot === 'back' ? `${base}/v${version}/back` : `${base}/v${version}`;
}

export function parseImageDataUrl(dataUrl: string): { mime: string; data: Buffer } | null {
  const match = /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i.exec(String(dataUrl).trim());
  if (!match) return null;

  const mime = match[1].toLowerCase();
  const data = Buffer.from(match[2], 'base64');
  if (!data.length) return null;
  if (data.length > MAX_IMAGE_BYTES) return null;
  return { mime, data };
}

/**
 * Stores a photo for a product and points the matching product column at the
 * image API route.
 */
export async function saveProductImage(
  productId: string,
  slot: ImageSlot,
  data: Buffer,
  mime: string,
): Promise<string> {
  await ensureTables();
  const db = getDb();
  await db.query(
    `INSERT INTO product_images (product_id, slot, mime, data)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (product_id, slot)
     DO UPDATE SET mime = EXCLUDED.mime, data = EXCLUDED.data, created_at = NOW()`,
    [productId, slot, mime, data],
  );

  // The version makes the URL change whenever the photo is replaced, so phones
  // and browsers never show a stale image from their cache.
  const url = productImageUrl(productId, slot, Date.now());
  const column = slot === 'back' ? 'hover_image_url' : 'image_url';
  await db.query(`UPDATE products SET ${column} = $2, updated_at = NOW() WHERE id = $1`, [productId, url]);
  return url;
}

export async function readProductImage(
  productId: string,
  slot: ImageSlot,
): Promise<{ mime: string; data: Buffer } | null> {
  if (!isDatabaseConfigured()) return null;

  try {
    await ensureTables();
    const db = getDb();
    const result = await db.query(
      'SELECT mime, data FROM product_images WHERE product_id = $1 AND slot = $2 LIMIT 1',
      [productId, slot],
    );
    const row = result.rows[0];
    if (!row) return null;
    return { mime: row.mime, data: row.data };
  } catch (error) {
    console.error('Product image read failed:', error);
    return null;
  }
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 40);
  }
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 40);
  }
  return [];
}

/** Validates the JSON body shared by the create and update endpoints. */
export function parseProductInput(body: unknown): ProductInputResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Send the product details as JSON.' };
  }

  const raw = body as Record<string, unknown>;
  const name = optionalString(raw.name);
  const team = optionalString(raw.team);

  if (!name || name.length < 2) return { ok: false, error: 'Add a product name.' };
  if (name.length > 160) return { ok: false, error: 'The product name is too long.' };
  if (!team) return { ok: false, error: 'Add the team this shirt belongs to.' };

  const price = Number(raw.price);
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: 'Add a valid price.' };

  const sleeveType = raw.sleeveType === 'long' ? 'long' : raw.sleeveType === 'short' ? 'short' : undefined;
  const rating = Number(raw.rating);
  const reviewsCount = Number(raw.reviews_count);

  return {
    ok: true,
    value: {
      name,
      team,
      price: Math.round(price * 100) / 100,
      league: optionalString(raw.league),
      player: optionalString(raw.player),
      number: optionalString(raw.number),
      sleeveType,
      category: optionalString(raw.category),
      description: optionalString(raw.description)?.slice(0, 2000),
      rating: Number.isFinite(rating) && rating >= 0 ? Math.min(5, rating) : 0,
      reviews_count: Number.isFinite(reviewsCount) && reviewsCount >= 0 ? Math.trunc(reviewsCount) : 0,
      sizes: stringArray(raw.sizes),
      colors: stringArray(raw.colors),
      available: raw.available !== false,
      is_new: Boolean(raw.is_new),
      is_featured: Boolean(raw.is_featured),
    },
  };
}
