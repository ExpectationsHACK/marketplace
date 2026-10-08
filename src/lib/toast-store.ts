"use client";

import { useSyncExternalStore } from "react";

// Spotify-style confirmation toasts ("Saved to Your Library", "Link copied").
// One at a time; a new toast replaces the current one.

export interface Toast {
  id: number;
  message: string;
}

let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let seq = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function toast(message: string) {
  current = { id: ++seq, message };
  clearTimeout(timer);
  timer = setTimeout(() => {
    current = null;
    emit();
  }, 3200);
  emit();
}

export function useToast(): Toast | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => null,
  );
}
