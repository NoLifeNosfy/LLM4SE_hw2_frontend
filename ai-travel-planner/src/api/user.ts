import apiClient from './index';

export const login = (email: string, password: string) => {
  return apiClient.post('/auth/login', { email, password });
};

export const register = (email: string, password: string) => {
  return apiClient.post('/auth/register', { email, password });
};
