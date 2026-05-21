"use client";

import { useEffect, useState } from "react";

export function useCursorPosition() {
  const [pos, setPos] = useState({ ln: 1, col: 1 });

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    let raf: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = main.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        const ln = Math.max(1, Math.floor(y / 22) + 1);
        const col = Math.max(1, Math.floor(x / 8) + 1);
        setPos({ ln, col });
      });
    };
    main.addEventListener("mousemove", onMove);
    return () => {
      main.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return pos;
}
