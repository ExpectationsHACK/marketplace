"use client";

import { useToast } from "@/lib/toast-store";

export function Toaster() {
  const toast = useToast();
  return (
    <div
      role="status"
      aria-live="polite"
      className="toaster pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-24"
    >
      {toast && (
        <p
          key={toast.id}
          className="animate-toast-in rounded-lg bg-toast px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgb(0_0_0/0.5)]"
        >
          {toast.message}
        </p>
      )}
    </div>
  );
}
