import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const EMPTY = { items: [], subtotal: 0, count: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    api('/cart').then(setCart).catch(() => {});
  }, []);

  // Reload whenever the user logs in or out (login merges the guest cart server-side).
  useEffect(() => {
    refresh();
  }, [refresh, user?.id]);

  const run = useCallback(async (fn) => {
    setBusy(true);
    try {
      setCart(await fn());
    } finally {
      setBusy(false);
    }
  }, []);

  const add = useCallback(
    async (productId, size, quantity = 1) => {
      await run(() => api('/cart', { method: 'POST', body: { productId, size, quantity } }));
      setOpen(true);
    },
    [run],
  );
  const update = useCallback(
    (id, quantity) => run(() => api(`/cart/${id}`, { method: 'PATCH', body: { quantity } })),
    [run],
  );
  const remove = useCallback((id) => run(() => api(`/cart/${id}`, { method: 'DELETE' })), [run]);

  return (
    <CartContext.Provider
      value={{ ...cart, busy, add, update, remove, refresh, clear: () => setCart(EMPTY), open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
