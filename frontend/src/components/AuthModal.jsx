import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CloseIcon } from './Icons';

const input =
  'w-full border border-ink/20 bg-white px-4 py-3 text-sm outline-none focus:border-ink placeholder:text-muted/70';

export default function AuthModal() {
  const { modalOpen, closeModal, login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!modalOpen) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await signup(form.name, form.email, form.password);
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="animate-fade-in absolute inset-0 bg-black/60" onClick={closeModal} />
      <div className="animate-fade-in relative w-full max-w-md bg-paper p-8 shadow-2xl">
        <button onClick={closeModal} className="absolute right-4 top-4" aria-label="Close">
          <CloseIcon />
        </button>
        <h2 className="font-display text-4xl uppercase">{mode === 'login' ? 'Log In' : 'Create Account'}</h2>
        <p className="mt-1 text-sm text-muted">
          {mode === 'login' ? 'Welcome back. Log in to place your order.' : 'Sign up in seconds to place your order.'}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          {mode === 'signup' && (
            <input className={input} placeholder="Full name" value={form.name} onChange={set('name')} required />
          )}
          <input
            className={input}
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            required
          />
          <input
            className={input}
            type="password"
            placeholder="Password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            value={form.password}
            onChange={set('password')}
            required
          />
          {error && <p className="text-sm text-brand">{error}</p>}
          <button
            disabled={loading}
            className="mt-2 bg-ink py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-brand disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button
            className="font-semibold underline hover:text-brand"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
          >
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
