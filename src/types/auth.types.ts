import type { Dish, UserSelection } from "./dish.types";

// User-related types
export interface User {
  id: number;
  username: string;
  name: string;
  isAdmin: boolean;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
export interface AdminPanelProps {
  allUsers: User[];
  allSelections: Record<number, UserSelection[]>;
  dishes: Dish[];
  onUpdateUserSelections: (userId: number, selections: UserSelection[]) => void;
  onDeleteUser: (userId: number) => void;
}

export interface UserManagementProps {
  users: User[];
  onDeleteUser: (userId: number) => void;
}
