// authService.ts
import { type User, type UserCredentials } from "../types";
import usersData from "../assets/users.json";

interface UserWithPassword extends User {
  password: string;
}

// Type assertion for the imported JSON
const users = usersData.users as UserWithPassword[];

/**
 * Simulates authentication with static user data
 */
export const authenticate = async (
  username: string,
  password: string
): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return null;

  // Return user object without password
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    isAdmin: user.isAdmin,
  };
};

/**
 * Validates if user credentials are correct
 */
export const validateCredentials = (credentials: UserCredentials): boolean => {
  const { username, password } = credentials;
  return users.some((u) => u.username === username && u.password === password);
};

/**
 * Get all users (for admin panel)
 */
export const getAllUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
  return users.map(({ ...user }) => user); // Strip passwords
};
