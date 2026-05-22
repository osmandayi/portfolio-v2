"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-border bg-panel-2 px-4 py-2.5">
              <div className="flex items-center gap-2 font-mono text-[12px] text-fg-muted">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <span className="uppercase tracking-wider">confirm.dialog</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-6 w-6 items-center justify-center rounded text-fg-muted hover:bg-panel hover:text-fg"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            <div className="px-5 py-5">
              <h2
                id="confirm-dialog-title"
                className="font-mono text-[15px] font-medium text-fg"
              >
                {title}
              </h2>
              <p className="mt-2 font-sans text-[14px] leading-relaxed text-fg-muted">
                {description}
              </p>
            </div>

            <footer className="flex justify-end gap-2 border-t border-border bg-panel-2/50 px-4 py-3">
              <button
                onClick={onClose}
                className="rounded-md border border-border px-3 py-1.5 text-[13px] text-fg-muted hover:border-accent/40 hover:text-fg"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="rounded-md border border-accent bg-accent px-3 py-1.5 text-[13px] font-medium text-white hover:bg-accent/90"
              >
                {confirmLabel}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
