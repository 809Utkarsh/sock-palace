import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { sql } from '../db.js';
import { signToken, requireUser } from '../auth.js';
import { mergeGuestCart } from './cart.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email };
}

router.post('/signup', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const hash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO users (name, email, password_hash, last_login_at)
    VALUES (${name}, ${email}, ${hash}, now())
    ON CONFLICT (email) DO NOTHING
    RETURNING id, name, email`;
  if (!rows.length) return res.status(409).json({ error: 'An account with this email already exists' });

  const user = rows[0];
  await mergeGuestCart(req.guestId, user.id);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  const [user] = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${email}`;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Wrong email or password' });
  }

  await sql`UPDATE users SET last_login_at = now() WHERE id = ${user.id}`;
  await mergeGuestCart(req.guestId, user.id);
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireUser, async (req, res) => {
  const [user] = await sql`SELECT id, name, email FROM users WHERE id = ${req.user.id}`;
  if (!user) return res.status(401).json({ error: 'Account not found' });
  res.json({ user: publicUser(user) });
});

export default router;
