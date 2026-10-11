import { Router } from 'express';
import { sql } from '../db.js';

const router = Router();
const MAX_QTY = 10;

// A cart belongs to the logged-in user, or (before login) to the anonymous guest id.
function owner(req) {
  return { userId: req.user?.id ?? null, guestId: req.guestId };
}

async function loadCart({ userId, guestId }) {
  const items = await sql`
    SELECT ci.id, ci.size, ci.quantity, p.id AS product_id, p.slug, p.name, p.price, p.images
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE (${userId}::int IS NOT NULL AND ci.user_id = ${userId}::int)
       OR (${userId}::int IS NULL AND ci.user_id IS NULL AND ci.guest_id = ${guestId}::uuid)
    ORDER BY ci.added_at`;
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  return { items, subtotal, count: items.reduce((n, i) => n + i.quantity, 0) };
}

// Called right after login/signup: moves the guest cart rows onto the user.
// guest_id stays on the row so you can see which visitor became which user.
export async function mergeGuestCart(guestId, userId) {
  if (!guestId) return;
  await sql`
    WITH moved AS (
      DELETE FROM cart_items
      WHERE guest_id = ${guestId}::uuid AND user_id IS NULL
      RETURNING guest_id, product_id, size, quantity
    )
    INSERT INTO cart_items (user_id, guest_id, product_id, size, quantity)
    SELECT ${userId}, guest_id, product_id, size, quantity FROM moved
    ON CONFLICT (user_id, product_id, size) WHERE user_id IS NOT NULL
    DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, ${MAX_QTY})`;
}

router.use((req, res, next) => {
  if (!req.user && !req.guestId) return res.status(400).json({ error: 'Missing guest id' });
  next();
});

router.get('/', async (req, res) => {
  res.json(await loadCart(owner(req)));
});

router.post('/', async (req, res) => {
  const productId = Number(req.body?.productId);
  const size = String(req.body?.size || '');
  const quantity = Math.min(Math.max(parseInt(req.body?.quantity, 10) || 1, 1), MAX_QTY);

  const [product] = await sql`SELECT id, sizes FROM products WHERE id = ${productId}`;
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!product.sizes.includes(size)) return res.status(400).json({ error: 'Pick a valid size' });

  const { userId, guestId } = owner(req);
  if (userId) {
    await sql`
      INSERT INTO cart_items (user_id, guest_id, product_id, size, quantity)
      VALUES (${userId}, ${guestId}, ${productId}, ${size}, ${quantity})
      ON CONFLICT (user_id, product_id, size) WHERE user_id IS NOT NULL
      DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, ${MAX_QTY}), added_at = now()`;
  } else {
    await sql`
      INSERT INTO cart_items (guest_id, product_id, size, quantity)
      VALUES (${guestId}, ${productId}, ${size}, ${quantity})
      ON CONFLICT (guest_id, product_id, size) WHERE user_id IS NULL
      DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, ${MAX_QTY}), added_at = now()`;
  }
  res.status(201).json(await loadCart({ userId, guestId }));
});

router.patch('/:id', async (req, res) => {
  const { userId, guestId } = owner(req);
  const quantity = parseInt(req.body?.quantity, 10);
  if (!(quantity >= 1 && quantity <= MAX_QTY)) {
    return res.status(400).json({ error: `Quantity must be 1-${MAX_QTY}` });
  }
  await sql`
    UPDATE cart_items SET quantity = ${quantity}
    WHERE id = ${Number(req.params.id)}
      AND ((${userId}::int IS NOT NULL AND user_id = ${userId}::int)
        OR (${userId}::int IS NULL AND user_id IS NULL AND guest_id = ${guestId}::uuid))`;
  res.json(await loadCart({ userId, guestId }));
});

router.delete('/:id', async (req, res) => {
  const { userId, guestId } = owner(req);
  await sql`
    DELETE FROM cart_items
    WHERE id = ${Number(req.params.id)}
      AND ((${userId}::int IS NOT NULL AND user_id = ${userId}::int)
        OR (${userId}::int IS NULL AND user_id IS NULL AND guest_id = ${guestId}::uuid))`;
  res.json(await loadCart({ userId, guestId }));
});

export default router;
