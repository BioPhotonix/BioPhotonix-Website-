"use client";

import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string; as?: "div" | "article" | "li" };

/** A bordered card whose glow follows the pointer. See .tech-card in globals.css. */
export default function TechCard({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag
      className={`tech-card rounded-2xl ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </Tag>
  );
}
