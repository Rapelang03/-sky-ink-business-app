"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS, DEMO_CREDENTIALS } from "@/lib/constants";
import { User, UserRole } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>(STORAGE_KEYS.USER, null);

  const login = (email: string, password: string): boolean => {
    // Check admin credentials
    if (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) {
      setUser({ role: "admin", email });
      return true;
    }
    // Check customer credentials
    if (email === DEMO_CREDENTIALS.customer.email && password === DEMO_CREDENTIALS.customer.password) {
      setUser({ role: "customer", email });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAdmin: user?.role === "admin",
    isCustomer: user?.role === "customer",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
