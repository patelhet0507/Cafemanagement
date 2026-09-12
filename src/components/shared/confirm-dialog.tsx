"use client";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({ open, title, description, confirmText = "Delete", variant = "danger", onConfirm, onCancel }: { open: boolean; title: string; description?: string; confirmText?: string; variant?: "danger" | "accent"; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-border p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${variant === "danger" ? "bg-error-bg text-error" : "bg-accent-light text-accent"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            {description && <p className="text-xs text-text-secondary mt-1 leading-relaxed">{description}</p>}
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-surface-hover">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white ${variant === "danger" ? "bg-error hover:bg-error/90" : "bg-accent hover:bg-accent-hover"}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
