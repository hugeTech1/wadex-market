import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { IUserData } from "../types/auth";
import type { IHTTPResponse } from "../types/http-response";
import { addUser, signinUser } from "../services/auth.service";

interface AuthContextType {
  user: IUserData | null;
  login: (username: string, password: string) => Promise<string | null>;
  register: (
    uuid: string,
    name: string,
    email: string,
    password: string,
    regDate: string,
    status: string,
    username: string
  ) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const validateUsername = (username: string): string | null => {
    if (!username.trim()) return "Username is required.";
    if (username.length < 4) return "Username must be at least 4 characters long.";
    if (username.length > 20) return "Username cannot exceed 20 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return "Username can only contain letters, numbers, and underscores.";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password.trim()) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must include at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must include at least one special character.";
    return null;
  };

  const register = async (
    uuid: string,
    name: string,
    email: string,
    password: string,
    regDate: string,
    status: string,
    username: string
  ): Promise<string | null> => {
    try {
      const usernameError = validateUsername(username);
      if (usernameError) return usernameError;

      const passwordError = validatePassword(password);
      if (passwordError) return passwordError;
      const response: IHTTPResponse<IUserData[]> = await addUser({
        uuid,
        email,
        name,
        password,
        regDate,
        status,
        username,
      });

      if (!response) return "No response from server.";

      if (response.status === "error" && response.message?.toLowerCase().includes("username")) {
        return response.message || "Username already exists.";
      }

      if (response.status === "OK") {
        const userData = response?.data[0]
        setUser(userData as any);
        localStorage.setItem("loggedUser", JSON.stringify(userData));
        return null;
      } else {
        return response.message || "Registration failed.";
      }
    } catch (error: any) {
      console.error("Register error:", error);
      return error?.message || "Server error during registration.";
    }
  };

  const login = async (username: string, password: string): Promise<string | null> => {
    try {
      const usernameError = validateUsername(username);
      if (usernameError) return usernameError;

      const passwordError = validatePassword(password);
      if (passwordError) return passwordError;

      const response: any = await signinUser({ username, password });

      if (!response) return "No response from server.";

      if (response.status === "OK" && response.data?.length) {
        const userData = response.data[0];
        console.log(userData)
        setUser(userData);
        localStorage.setItem("loggedUser", JSON.stringify(userData));
        return null;
      } else {
        return response.message || "Invalid username or password.";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return error?.message || "Server error during login.";
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside AuthProvider");
  return auth;
};