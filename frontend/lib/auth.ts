// lib/auth.ts
import type { AppUser } from "./types";

export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

const MOCK_USER: AppUser = { id: "dev-user", username: "DevUser" };

/** Returns the current user for personalization. Uses stored user when authenticated; in dev can return mock. */
export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  const user = getUser();
  if (user) {
    return {
      id: String(user.id),
      username: user.username,
      avatarUrl: (user as User & { avatarUrl?: string }).avatarUrl,
    };
  }
  // TODO: Wire up real Discord session (e.g. NextAuth session) and return user from there.
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    return MOCK_USER;
  }
  return null;
}

/** Sets auth state for a test user so you can develop without Discord. Call from LoginModal "Use test user". */
export function loginWithTestUser(): void {
  if (typeof window === "undefined") return;
  setAuthData("dev-jwt", {
    id: 0,
    username: MOCK_USER.username,
    email: "",
    confirmed: true,
    blocked: false,
    createdAt: "",
    updatedAt: "",
  });
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
  // Development bypass: Skip authentication if NEXT_PUBLIC_BYPASS_AUTH is true
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
    return true;
  }
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