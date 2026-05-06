"use client";

import React, { useState, useRef, useEffect } from "react";
import { vocabulary } from "@/components/tutorial/constants/vocabulary";

type VocabularyTerm = keyof typeof vocabulary;

interface SideRemarkProps {
  term: VocabularyTerm;
}

export function SideRemark({ term }: SideRemarkProps) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLSpanElement>(null);
  const description = vocabulary[term];
  if (process.env.NODE_ENV !== "production" && !description) {
    throw new Error(`SideRemark: no vocabulary entry for "${term}"`);
  }
  const noteId = `side-remark-${term.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleToggle() {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const popoverW = 256;
      const pad = 8;
      const centerX = r.left + r.width / 2;
      const left = Math.max(pad, Math.min(centerX - popoverW / 2, window.innerWidth - popoverW - pad));
      setPopoverStyle({ position: "fixed", bottom: window.innerHeight - r.top + 8, left });
    }
    setOpen((o) => !o);
  }

  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls={noteId}
        aria-describedby={open ? noteId : undefined}
        aria-label={`Stats aside for "${term}"`}
        className="inline cursor-pointer"
      >
        <strong className="text-accent">{term}</strong>
        <span
          className="ml-0.5 inline-flex items-center justify-center rounded-full border border-accent/50 text-accent transition-colors hover:border-accent hover:text-accent"
          style={{ width: "1em", height: "1em", fontSize: "0.7em", verticalAlign: "super" }}
          aria-hidden="true"
        >
          i
        </span>
      </button>
      {open && (
        <span
          id={noteId}
          role="note"
          style={popoverStyle}
          className="z-10 w-64 rounded-md border border-foreground/15 bg-background px-4 py-3 text-sm text-foreground/70 shadow-lg"
        >
          {description}
        </span>
      )}
    </span>
  );
}
