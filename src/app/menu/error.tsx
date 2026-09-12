"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-center">
      <h2 className="text-lg font-semibold">Menu failed to load</h2>
      <p className="text-sm text-text-secondary mt-2">{error.message}</p>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 rounded-xl bg-accent text-white text-sm">Reload</button>
    </div>
  );
}
