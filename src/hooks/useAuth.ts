import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { type AuthContextType } from "../types";

// Custom hook to access auth context values
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
