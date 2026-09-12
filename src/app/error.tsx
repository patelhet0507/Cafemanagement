"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-text-secondary mt-2 max-w-md">{error.message || "Unexpected error"}</p>
      <div className="flex gap-2 mt-6">
        <button onClick={() => reset()} className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium">Reload</button>
        <button onClick={() => window.history.back()} className="px-4 py-2 rounded-xl border border-border text-sm">Back</button>
      </div>
    </div>
  );
}
