export type StaffRole = "owner" | "manager" | "chef" | "cashier";

export interface StaffUser {
  email: string;
  name: string;
  role: StaffRole;
}

export const DEMO_USERS: Array<StaffUser & { password: string }> = [
  { email: "owner@cafeflow.demo", password: "Owner123!", name: "Het", role: "owner" },
  { email: "manager@cafeflow.demo", password: "Manager123!", name: "Priya", role: "manager" },
  { email: "chef@cafeflow.demo", password: "Chef123!", name: "Rahul", role: "chef" },
  { email: "cashier@cafeflow.demo", password: "Cashier123!", name: "Ananya", role: "cashier" },
];

const KEY = "cafeflow_staff";

export function getStoredUser(): StaffUser | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as StaffUser) : null;
  } catch { return null; }
}

export function setStoredUser(u: StaffUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
}

export function validateLogin(email: string, password: string): StaffUser | null {
  const normalized = email.trim().toLowerCase();
  const found = DEMO_USERS.find((u) => u.email.toLowerCase() === normalized && u.password === password);
  if (!found) return null;
  const { password: _, ...user } = found;
  return user;
}

export function canAccess(role: StaffRole, path: string): boolean {
  if (role === "owner" || role === "manager") return true;
  if (role === "chef") return path.startsWith("/kitchen");
  if (role === "cashier") return path.startsWith("/pos");
  return false;
}

export const PROTECTED_PREFIXES = ["/dashboard", "/pos", "/kitchen"];
