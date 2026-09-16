import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0";

const variants: Record<Variant, string> = {
  solid: "bg-teal-400 text-ink-950 hover:bg-teal-300 hover:shadow-[0_0_32px_rgba(27,195,205,0.35)]",
  outline: "border border-line-strong text-fog hover:border-teal-400 hover:text-teal-300",
  ghost: "text-fog/85 hover:text-teal-300",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode };

export default function Button({ variant = "solid", className = "", children, ...rest }: Props) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 8h11M9 4l4 4-4 4" />
      </svg>
    </Link>
  );
}
