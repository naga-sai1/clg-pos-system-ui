interface User {
  userId: number;
  username: string;
  email: string;
  role: "admin" | "cashier";
}

interface AuthData {
  token: string;
  user: User;
}

const STORAGE_KEY = "pos_auth_data";

export const storage = {
  getAuthData: (): AuthData | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  setAuthData: (authData: AuthData): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  },

  clearAuthData: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!storage.getAuthData()?.token;
  },

  getUser: (): User | null => {
    return storage.getAuthData()?.user || null;
  },

  isAdmin: (): boolean => {
    return storage.getUser()?.role === "admin";
  },

  isCashier: (): boolean => {
    return storage.getUser()?.role === "cashier";
  }
};
