// authContext.tsx
import { createContext, useState, useEffect, type FC } from "react";
import { authenticate } from "../service/authService";
import { type AuthContextType, type AuthProviderProps, type User } from "../types";

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await authenticate(username, password);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = (): void => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userVotes");
  };

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};