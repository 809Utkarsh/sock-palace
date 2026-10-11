import { useEffect, useState } from 'react';
import { api } from './api';

export function useProducts(query = '') {
  const [state, setState] = useState({ products: [], loading: true, error: '' });
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    api(`/products${query}`)
      .then((d) => alive && setState({ products: d.products, loading: false, error: '' }))
      .catch((e) => alive && setState({ products: [], loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, [query]);
  return state;
}
