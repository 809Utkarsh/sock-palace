// Creates all tables and loads the sample socks. Safe to run again any time:
// existing tables are kept and products are updated by slug (ids stay the same).
// Usage: npm run db:setup
import { sql } from '../src/db.js';
import products from './products.js';

const schema = [
  `CREATE TABLE IF NOT EXISTS users (
     id            SERIAL PRIMARY KEY,
     name          TEXT NOT NULL,
     email         TEXT NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
     last_login_at TIMESTAMPTZ
   )`,
  `CREATE TABLE IF NOT EXISTS products (
     id               SERIAL PRIMARY KEY,
     slug             TEXT NOT NULL UNIQUE,
     name             TEXT NOT NULL,
     description      TEXT NOT NULL DEFAULT '',
     price            NUMERIC(10,2) NOT NULL,
     compare_at_price NUMERIC(10,2),
     category         TEXT NOT NULL,
     tag              TEXT,
     images           TEXT[] NOT NULL DEFAULT '{}',
     sizes            TEXT[] NOT NULL DEFAULT '{S,M,L}',
     sort_order       INT NOT NULL DEFAULT 0,
     created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  // Every "Add to Cart" lands here. Before login only guest_id is set;
  // after login user_id is filled in (guest_id is kept for tracking).
  `CREATE TABLE IF NOT EXISTS cart_items (
     id         SERIAL PRIMARY KEY,
     user_id    INT REFERENCES users(id) ON DELETE CASCADE,
     guest_id   UUID,
     product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
     size       TEXT NOT NULL,
     quantity   INT NOT NULL CHECK (quantity BETWEEN 1 AND 10),
     added_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
     CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS cart_user_line ON cart_items (user_id, product_id, size) WHERE user_id IS NOT NULL`,
  `CREATE UNIQUE INDEX IF NOT EXISTS cart_guest_line ON cart_items (guest_id, product_id, size) WHERE user_id IS NULL`,
  `CREATE TABLE IF NOT EXISTS orders (
     id         SERIAL PRIMARY KEY,
     user_id    INT NOT NULL REFERENCES users(id),
     total      NUMERIC(10,2) NOT NULL,
     status     TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','shipped','delivered','cancelled')),
     full_name  TEXT NOT NULL,
     phone      TEXT NOT NULL,
     address    TEXT NOT NULL,
     city       TEXT NOT NULL,
     pincode    TEXT NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS order_items (
     id                SERIAL PRIMARY KEY,
     order_id          INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
     product_id        INT NOT NULL REFERENCES products(id),
     size              TEXT NOT NULL,
     quantity          INT NOT NULL,
     price_at_purchase NUMERIC(10,2) NOT NULL
   )`,
];

for (const statement of schema) await sql.query(statement);
console.log('Tables ready');

for (const [i, p] of products.entries()) {
  await sql`
    INSERT INTO products (slug, name, description, price, compare_at_price, category, tag, images, sizes, sort_order)
    VALUES (${p.slug}, ${p.name}, ${p.description}, ${p.price}, ${p.compareAt ?? null}, ${p.category},
            ${p.tag ?? null}, ${[`/products/${p.slug}-1.svg`, `/products/${p.slug}-2.svg`]}, ${p.sizes ?? ['S', 'M', 'L']}, ${i})
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
      compare_at_price = EXCLUDED.compare_at_price, category = EXCLUDED.category, tag = EXCLUDED.tag,
      images = EXCLUDED.images, sizes = EXCLUDED.sizes, sort_order = EXCLUDED.sort_order`;
}
console.log(`${products.length} products loaded`);
