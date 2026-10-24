"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "neutral";
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export function showToast(message: Omit<ToastMessage, "id">) {
  const fullToast: ToastMessage = {
    ...message,
    id: Math.random().toString(36).substring(2, 9),
  };
  toastListeners.forEach((fn) => fn(fullToast));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (newToast: ToastMessage) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/20 bg-neutral-950/90 px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 animate-fade-up"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
            ✓
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-white">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-white/40 hover:text-white text-xs leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
