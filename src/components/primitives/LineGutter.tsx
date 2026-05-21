"use client";

import { cn } from "@/lib/cn";

export function LineGutter({ lines, className }: { lines: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "select-none pr-3 text-right text-[12px] leading-[22px] text-fg-muted",
        className,
      )}
    >
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}
