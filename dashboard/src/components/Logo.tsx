/**
 * Brand lockup drawn in SVG so the admin never waits on an asset.
 * Swap in the supplied logo file later by replacing this component only.
 */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="HAJAR"
      className="shrink-0"
    >
      <circle cx="32" cy="32" r="31" fill="var(--hj-ink)" />
      <circle
        cx="32"
        cy="32"
        r="25"
        fill="none"
        stroke="var(--hj-gold)"
        strokeWidth="1"
        strokeDasharray="1.5 3"
        opacity="0.75"
      />
      <circle
        cx="32"
        cy="32"
        r="18"
        fill="none"
        stroke="var(--hj-gold)"
        strokeWidth="1.2"
      />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="'Amiri', 'Times New Roman', serif"
        fontSize="21"
        fill="var(--hj-gold-soft)"
      >
        هجر
      </text>
    </svg>
  );
}

export function Wordmark({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark />
      <div className="leading-none">
        <p className="font-display text-xl font-semibold tracking-brand text-hj-ink">
          HAJAR
        </p>
        {subtitle && (
          <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-hj-muted">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
