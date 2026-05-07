import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearStoredToken,
  getMe,
  getStoredToken,
  loginUser,
  registerUser,
  setStoredToken
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const data = await getMe(token);
        setUser(data.user);
      } catch (_error) {
        clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    bootstrapAuth();
  }, [token]);

  const authActions = useMemo(
    () => ({
      async register(payload) {
        return registerUser(payload);
      },
      async login(payload) {
        const data = await loginUser(payload);
        setStoredToken(data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
      },
      logout() {
        clearStoredToken();
        setToken(null);
        setUser(null);
      },
      async refreshMe() {
        if (!token) return null;
        const data = await getMe(token);
        setUser(data.user);
        return data.user;
      }
    }),
    [token]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isAuthLoading,
      ...authActions
    }),
    [user, token, isAuthLoading, authActions]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth AuthProvider ichida ishlatilishi kerak.");
  }
  return context;
}

