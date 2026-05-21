"use client";

import { useEffect, useState } from "react";

const FLAG = "portfolio.typed";

export function TypingText({
  text,
  speed = 35,
  className,
  once = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  once?: boolean;
}) {
  const [shown, setShown] = useState(() => {
    if (typeof window === "undefined") return text;
    if (once && sessionStorage.getItem(FLAG)) return text;
    return "";
  });

  useEffect(() => {
    if (shown === text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      if (once) sessionStorage.setItem(FLAG, "1");
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        if (once) sessionStorage.setItem(FLAG, "1");
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, once, shown]);

  return (
    <span className={className}>
      {shown}
      {shown !== text && <span className="ml-0.5 inline-block h-[1em] w-[2px] bg-current animate-caret-blink align-middle" />}
    </span>
  );
}
