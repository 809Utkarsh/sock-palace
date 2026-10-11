import { Router } from 'express';
import { sql } from '../db.js';
import { requireUser } from '../auth.js';

const router = Router();
router.use(requireUser);

const FIELDS = ['fullName', 'phone', 'address', 'city', 'pincode'];

router.post('/', async (req, res) => {
  const ship = {};
  for (const f of FIELDS) {
    ship[f] = String(req.body?.[f] || '').trim();
    if (!ship[f]) return res.status(400).json({ error: 'Please fill in all delivery details' });
  }

  // One statement = one atomic transaction: create order, copy cart lines, empty cart.
  const userId = req.user.id;
  const [order] = await sql`
    WITH c AS (
      SELECT ci.product_id, ci.size, ci.quantity, p.price
      FROM cart_items ci JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ${userId}
    ),
    o AS (
      INSERT INTO orders (user_id, total, status, full_name, phone, address, city, pincode)
      SELECT ${userId}, SUM(c.price * c.quantity), 'pending',
             ${ship.fullName}, ${ship.phone}, ${ship.address}, ${ship.city}, ${ship.pincode}
      FROM c HAVING COUNT(*) > 0
      RETURNING id, total, status, created_at
    ),
    oi AS (
      INSERT INTO order_items (order_id, product_id, size, quantity, price_at_purchase)
      SELECT o.id, c.product_id, c.size, c.quantity, c.price FROM o, c
    ),
    d AS (
      DELETE FROM cart_items WHERE user_id = ${userId} AND EXISTS (SELECT 1 FROM o)
    )
    SELECT * FROM o`;

  if (!order) return res.status(400).json({ error: 'Your cart is empty' });
  res.status(201).json({ order });
});

router.get('/', async (req, res) => {
  const orders = await sql`
    SELECT o.id, o.total, o.status, o.created_at,
           json_agg(json_build_object(
             'name', p.name, 'slug', p.slug, 'image', p.images[1],
             'size', oi.size, 'quantity', oi.quantity, 'price', oi.price_at_purchase
           ) ORDER BY oi.id) AS items
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ${req.user.id}
    GROUP BY o.id
    ORDER BY o.created_at DESC`;
  res.json({ orders });
});

export default router;
