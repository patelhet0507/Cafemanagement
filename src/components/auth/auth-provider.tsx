"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getStoredUser, setStoredUser, validateLogin, canAccess, PROTECTED_PREFIXES, type StaffUser } from "@/lib/auth";

type Ctx = { user: StaffUser | null; login: (e: string, p: string) => string | null; logout: () => void };
const AuthCtx = createContext<Ctx>({ user: null, login: () => "not ready", logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setUser(getStoredUser()); setReady(true); }, []);

  useEffect(() => {
    if (!ready) return;
    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    if (isProtected && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !canAccess(user.role, pathname)) {
      // role mismatch -> redirect to allowed home
      if (user.role === "chef") router.replace("/kitchen");
      else if (user.role === "cashier") router.replace("/pos");
      else router.replace("/dashboard");
    }
  }, [user, pathname, ready, router]);

  const login = (email: string, pwd: string) => {
    const u = validateLogin(email, pwd);
    if (!u) return "Invalid email or password";
    setStoredUser(u); setUser(u); return null;
  };
  const logout = () => { setStoredUser(null); setUser(null); router.replace("/login"); };

  if (!ready) return null;
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
