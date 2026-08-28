"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Toast({
  message,
  onClose,
  duration = 4000,
}: {
  message: string;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div
        role="alert"
        className="pointer-events-auto max-w-sm rounded-md border border-[var(--error)] bg-[var(--card)] px-4 py-3 text-sm font-medium text-[var(--error)]"
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
