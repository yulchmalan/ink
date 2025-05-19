"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";

type DecodedToken = {
  userId: string;
};

type User = {
  _id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  logout: () => void;
  login: (token: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const session = await getSession();

      if (session?.accessToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(session.accessToken);
          await fetchUser(decoded.userId, session.accessToken);
          return;
        } catch (err) {
          console.warn("Невалідний токен із сесії");
          logout();
        }
      }

      const localToken = localStorage.getItem("token");
      if (localToken) {
        try {
          const decoded = jwtDecode<DecodedToken>(localToken);
          await fetchUser(decoded.userId, localToken);
        } catch (err) {
          console.warn("Невалідний токен із localStorage");
          logout();
        }
      }
    };

    init();
  }, []);

  const fetchUser = async (userId: string, token?: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: `
            query GetUser($id: ObjectID!) {
              user(id: $id) {
                _id
                username
                email
              }
            }
          `,
          variables: { id: userId },
        }),
      });

      const json = await res.json();

      if (json.data?.user) {
        setUser(json.data.user);
        setIsLoggedIn(true);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Не вдалося отримати користувача", err);
      logout();
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      fetchUser(decoded.userId, token);
    } catch (err) {
      console.error("Помилка під час декодування токена", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
