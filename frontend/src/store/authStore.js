import { create } from 'zustand';
import api from '../utils/api.js';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,

  // Called on app start to restore session
  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) return set({ loading: false });
    try {
      const { data } = await api.get('/api/auth/me');
      set({ user: data.user, token, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true }); // ✅ ADD THIS

      const { data } = await api.post('/api/auth/login', { email, password });

      localStorage.setItem('token', data.token);

      set({ user: data.user, token: data.token, loading: false }); // ✅

    } catch (err) {
      set({ loading: false }); // ✅ important
      throw err;
    }
  },

  signup: async (username, email, password) => {
    try {
      set({ loading: true });
      const { data } = await api.post('/api/auth/signup', { username, email, password });
      localStorage.setItem('token', data.token);

      set({ user: data.user, token: data.token, loading: false });
    }
    catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
