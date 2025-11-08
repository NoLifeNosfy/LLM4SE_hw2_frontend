import { defineStore } from 'pinia';
import { login as loginApi, register as registerApi, getProfile } from '../api/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null as { email: string; id: string } | null,
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
        await this.getProfile();
      } catch (error: any) {
        console.error('Login failed:', error);
        throw error.response?.data || error;
      }
    },
    async register(email, password) {
      try {
        await registerApi(email, password);
      } catch (error: any) {
        console.error('Registration failed:', error);
        throw error.response?.data || error;
      }
    },
    async getProfile() {
      if (!this.token) return;
      try {
        const response = await getProfile();
        this.user = response.data;
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
  },
});
