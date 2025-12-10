// lib/auth.ts
export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  window.location.href = '/auth/login';
};

export const setAuthData = (jwt: string, user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jwt', jwt);
  localStorage.setItem('user', JSON.stringify(user));
};