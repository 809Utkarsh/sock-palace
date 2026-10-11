import express from 'express';
import cors from 'cors';
import { identify } from './auth.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

const app = express();

// FRONTEND_URL can be a comma-separated list, e.g. "https://sockpalace.vercel.app,http://localhost:5173"
const allowed = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(cors({ origin: allowed }));
app.use(express.json({ limit: '20kb' }));
app.use(identify);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong, please try again' });
});

export default app;
