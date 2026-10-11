const API = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

function storage(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    return null;
  }
}

// Anonymous id for this browser, so the cart can be saved in the DB before login.
let guestId = storage('guestId');
if (!guestId) {
  guestId = crypto.randomUUID();
  storage('guestId', guestId);
}

export const tokenStore = {
  get: () => storage('token'),
  set: (t) => storage('token', t),
  clear: () => storage('token', null),
};

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'x-guest-id': guestId };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
