import type { ButtonHTMLAttributes, CSSProperties, ElementType, ReactNode } from "react";

import { cx } from "@/lib/format";

/* ==========================================================================
   Reveal — declarative wrapper around the document-wide scroll observer.
   `index` staggers siblings; the CSS reads it as --i.
   ========================================================================== */
type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  mode?: "up" | "mask" | "fade";
  index?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export function Reveal({
  children,
  as: Tag = "div",
  mode = "up",
  index = 0,
  className,
  style,
  id,
}: RevealProps) {
  return (
    <Tag
      id={id}
      data-reveal={mode === "up" ? "" : mode}
      className={className}
      style={{ ...style, ["--i" as string]: index }}
    >
      {children}
    </Tag>
  );
}

/* ==========================================================================
   Eyebrow — the tracked micro-label with a rule, used to open every section.
   ========================================================================== */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "label inline-flex items-center gap-3",
        tone === "dark" ? "text-smoke" : "text-bone/60",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cx("h-px w-8", tone === "dark" ? "bg-ink/30" : "bg-bone/40")}
      />
      {children}
    </span>
  );
}

/* ==========================================================================
   Button
   ========================================================================== */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "light" | "ghost";
  size?: "sm" | "md" | "lg";
  full?: boolean;
};

const BASE =
  "relative inline-flex items-center justify-center gap-2 label whitespace-nowrap transition-[background-color,color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.985]";

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  solid: "bg-ink text-bone hover:bg-clay",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-bone",
  light: "bg-bone text-ink hover:bg-clay hover:text-bone",
  ghost: "text-ink hover:text-clay",
};

const SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-14 px-9",
};

export function Button({
  variant = "solid",
  size = "md",
  full = false,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(BASE, VARIANTS[variant], SIZES[size], full && "w-full", className)}
      {...rest}
    />
  );
}

/* ==========================================================================
   SectionHeading — eyebrow + display line + optional aside, one consistent
   rhythm used by every section on the page.
   ========================================================================== */
export function SectionHeading({
  eyebrow,
  title,
  aside,
  tone = "dark",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  tone?: "dark" | "light";
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <Reveal mode="fade">
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal index={1} className="overflow-hidden">
          <h2
            id={id}
            className={cx(
              "display mt-6 text-[clamp(2.5rem,6vw,4.75rem)]",
              tone === "dark" ? "text-ink" : "text-bone",
            )}
          >
            {title}
          </h2>
        </Reveal>
      </div>
      {aside ? (
        <Reveal index={2} className="md:max-w-xs md:text-right">
          <div className={cx("text-sm leading-relaxed", tone === "dark" ? "text-smoke" : "text-bone/60")}>
            {aside}
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
