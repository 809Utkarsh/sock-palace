import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CloseIcon } from './Icons';

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
      <div className="animate-fade-in absolute inset-0 bg-black/75" onClick={closeModal} />
      <div className="animate-fade-in relative w-full max-w-md border border-line/50 bg-panel p-8">
        <button onClick={closeModal} className="absolute right-4 top-4 hover:opacity-70" aria-label="Close">
          <CloseIcon />
        </button>
        <h2 className="display text-2xl">{mode === 'login' ? 'Log In' : 'Create Account'}</h2>
        <p className="caps mt-2 text-muted">
          {mode === 'login' ? 'Welcome back. Log in to place your order.' : 'Sign up in seconds to place your order.'}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          {mode === 'signup' && <input className="field" placeholder="Full name" value={form.name} onChange={set('name')} required />}
          <input className="field" type="email" placeholder="Email" autoComplete="email" value={form.email} onChange={set('email')} required />
          <input
            className="field"
            type="password"
            placeholder="Password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            value={form.password}
            onChange={set('password')}
            required
          />
          {error && <p className="caps text-danger">{error}</p>}
          <button disabled={loading} className="btn-solid mt-2">
            {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="caps mt-6 text-center">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button
            className="caps font-bold underline underline-offset-4 hover:opacity-70"
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
