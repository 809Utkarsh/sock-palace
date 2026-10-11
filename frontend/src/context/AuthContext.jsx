import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api, tokenStore } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const afterLogin = useRef(null);

  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => tokenStore.clear());
  }, []);

  // Opens the login popup; `then` runs once the user has logged in.
  const requireLogin = useCallback((then) => {
    afterLogin.current = then || null;
    setModalOpen(true);
  }, []);

  const finish = useCallback((data) => {
    tokenStore.set(data.token);
    setUser(data.user);
    setModalOpen(false);
    const next = afterLogin.current;
    afterLogin.current = null;
    next?.(data.user);
  }, []);

  const login = useCallback(
    async (email, password) => finish(await api('/auth/login', { method: 'POST', body: { email, password } })),
    [finish],
  );
  const signup = useCallback(
    async (name, email, password) =>
      finish(await api('/auth/signup', { method: 'POST', body: { name, email, password } })),
    [finish],
  );
  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, requireLogin, modalOpen, closeModal: () => setModalOpen(false) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
