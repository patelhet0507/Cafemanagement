"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";

interface PhoneEntryModalProps {
  onSubmit: (phone: string) => void;
}

export function PhoneEntryModal({ onSubmit }: PhoneEntryModalProps) {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      onSubmit(phone);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    return digits;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-sm bg-surface rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">Almost there ☕</h2>
            <p className="text-sm text-text-secondary mt-1">
              Enter your mobile number to receive order updates.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-background focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                <span className="text-sm font-medium text-text-secondary select-none">+91</span>
                <div className="w-px h-5 bg-border" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="XXXXX XXXXX"
                  className="flex-1 bg-transparent text-lg font-mono tracking-wider outline-none placeholder:text-text-muted"
                  autoFocus
                  maxLength={10}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={phone.length < 10}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-accent text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-text-muted text-center mt-4">
            We&apos;ll only use this for order updates. No spam.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
