import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, TOKEN_KEY } from "./api";

const EMAIL_KEY = "hj-admin-email";

type AuthCtx = {
  token: string | null;
  email: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [email, setEmail] = useState<string | null>(() =>
    localStorage.getItem(EMAIL_KEY)
  );

  const value = useMemo<AuthCtx>(
    () => ({
      token,
      email,
      async signIn(nextEmail: string, password: string) {
        const { data } = await api.post<{
          accessToken: string;
          user: { email: string };
        }>("/auth/login", { email: nextEmail, password });
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(EMAIL_KEY, data.user?.email ?? nextEmail);
        setToken(data.accessToken);
        setEmail(data.user?.email ?? nextEmail);
      },
      signOut() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EMAIL_KEY);
        setToken(null);
        setEmail(null);
      },
    }),
    [token, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth used outside AuthProvider");
  return ctx;
}
