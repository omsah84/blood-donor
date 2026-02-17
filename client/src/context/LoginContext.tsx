"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "patient" | "donor" | "organization";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface LoginContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <LoginContext.Provider value={{ user, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) throw new Error("useLogin must be used within LoginProvider");
  return context;
};
