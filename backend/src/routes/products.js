import { Router } from 'express';
import { sql } from '../db.js';

const router = Router();

// ?category=crew|ankle|knee-high|packs  ?tag=new-drop|bestseller|limited-edition
router.get('/', async (req, res) => {
  const category = req.query.category ? String(req.query.category) : null;
  const tag = req.query.tag ? String(req.query.tag) : null;
  const products = await sql`
    SELECT id, slug, name, price, compare_at_price, category, tag, images, sizes
    FROM products
    WHERE (${category}::text IS NULL OR category = ${category})
      AND (${tag}::text IS NULL OR tag = ${tag})
    ORDER BY sort_order, id`;
  res.json({ products });
});

router.get('/:slug', async (req, res) => {
  const [product] = await sql`SELECT * FROM products WHERE slug = ${req.params.slug}`;
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

export default router;
