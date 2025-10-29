import { defineStore } from 'pinia';
import { login as loginApi, register as registerApi } from '../api/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await loginApi(email, password);
        this.token = response.data.access_token;
        localStorage.setItem('token', this.token);
        // You might want to fetch user profile here
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    async register(email, password) {
      try {
        await registerApi(email, password);
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});
