import type { ReactNode } from "react";

export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ");
}

export function Card({
  children,
  className,
  tone = "plain",
}: {
  children: ReactNode;
  className?: string;
  tone?: "plain" | "accent" | "warn" | "danger";
}) {
  const tones = {
    plain: "bg-surface border-line",
    accent: "bg-accent-soft border-accent/30",
    warn: "bg-warn-soft border-warn/30",
    danger: "bg-danger-soft border-danger/40",
  } as const;

  return (
    <div className={cx("rounded-2xl border p-4 sm:p-5", tones[tone], className)}>{children}</div>
  );
}

export function Pill({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: "plain" | "accent" | "warn" | "danger";
}) {
  const tones = {
    plain: "bg-surface-2 text-ink-soft border-line",
    accent: "bg-accent-soft text-accent border-accent/30",
    warn: "bg-warn-soft text-warn border-warn/30",
    danger: "bg-danger-soft text-danger border-danger/40",
  } as const;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "quiet" | "danger" | "warn";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const variants = {
    primary: "bg-accent text-accent-ink hover:opacity-90",
    quiet: "bg-surface border border-line text-ink hover:bg-surface-2",
    danger: "bg-danger text-white hover:opacity-90",
    warn: "bg-warn text-white hover:opacity-90",
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  onClick,
  tone = "plain",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "plain" | "accent";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1.5 text-left text-sm transition",
        tone === "accent"
          ? "border-accent/40 bg-accent-soft text-accent hover:opacity-90"
          : "border-line bg-surface text-ink-soft hover:bg-surface-2",
      )}
    >
      {children}
    </button>
  );
}

export function SectionHeading({
  children,
  as: Tag = "h2",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  return (
    <Tag className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{children}</Tag>
  );
}
