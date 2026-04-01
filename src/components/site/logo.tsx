import { cn } from "@/lib/utils";

export type SavianeLogoMarkProps = {
  /** Pixel size (width & height) */
  size?: number;
  className?: string;
};

/**
 * Compass rose mark from Saviane brand lockup (dark primary variant).
 */
export function SavianeLogoMark({ size = 28, className }: SavianeLogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect x="1" y="1" width="70" height="70" stroke="#3a3726" strokeWidth="0.5" />
      <rect x="9" y="9" width="54" height="54" stroke="#2a2820" strokeWidth="0.5" />
      <line x1="36" y1="9" x2="36" y2="63" stroke="#3a8c6e" strokeWidth="0.5" />
      <line x1="9" y1="36" x2="63" y2="36" stroke="#3a8c6e" strokeWidth="0.5" />
      <line x1="9" y1="9" x2="63" y2="63" stroke="#2a2820" strokeWidth="0.5" />
      <line x1="63" y1="9" x2="9" y2="63" stroke="#2a2820" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="12" fill="none" stroke="#b8a882" strokeWidth="0.5" />
      <circle cx="36" cy="36" r="2.5" fill="#b8a882" />
      <circle cx="36" cy="24" r="2" fill="#3a8c6e" />
      <circle cx="36" cy="48" r="2" fill="#3a8c6e" />
      <circle cx="24" cy="36" r="2" fill="#3a8c6e" />
      <circle cx="48" cy="36" r="2" fill="#3a8c6e" />
    </svg>
  );
}

export type SavianeLogoProps = {
  showWordmark?: boolean;
  className?: string;
  /** Mark size in px */
  markSize?: number;
  /** Wordmark typography */
  wordmarkClassName?: string;
  /** Mark wrapper (e.g. spacing); mark uses fixed brand colors */
  markClassName?: string;
};

export function SavianeLogo({
  showWordmark = true,
  className,
  markSize,
  wordmarkClassName,
  markClassName,
}: SavianeLogoProps) {
  const m = markSize ?? (showWordmark ? 28 : 22);
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className={cn("inline-flex", markClassName)}>
        <SavianeLogoMark size={m} />
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "font-sans text-foreground text-lg font-light tracking-[0.28em]",
            wordmarkClassName
          )}
        >
          saviane
        </span>
      ) : null}
    </span>
  );
}
