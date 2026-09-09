import { Link } from "react-router-dom";
import { LogoMark } from "../components/Logo";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hj-cream px-4 text-center">
      <LogoMark size={52} />
      <p className="mt-8 font-display text-7xl text-hj-border-strong">404</p>
      <h1 className="mt-2 font-display text-3xl text-hj-ink">
        This page is not in the atelier.
      </h1>
      <Link
        to="/"
        className="mt-8 inline-flex h-11 items-center rounded-sm bg-hj-ink px-6 text-[11px] uppercase tracking-[0.16em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink"
      >
        Back to admin
      </Link>
    </div>
  );
}
