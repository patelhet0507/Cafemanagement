"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { Check, AlertCircle, X } from "lucide-react";

type Toast = { id: string; msg: string; type: "success" | "error" };
const Ctx = createContext<(msg: string, type?: Toast["type"]) => void>(() => {});

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="fixed bottom-4 right-4 z-[70] space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium min-w-[280px] ${t.type === "success" ? "bg-success text-white border-success" : "bg-error text-white border-error"}`}>
            {t.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span className="flex-1">{t.msg}</span>
            <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} className="opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
