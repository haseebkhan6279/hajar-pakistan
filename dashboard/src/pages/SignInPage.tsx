import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { LogoMark } from "../components/Logo";

export function SignInPage() {
  const { token, signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      await signIn(String(fd.get("email")), String(fd.get("password")));
      navigate("/");
    } catch {
      setError("Those credentials were not recognised.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-hj-ink p-12 lg:flex">
        <LogoMark size={48} />
        <div>
          <p className="font-display text-5xl leading-tight text-white">
            Hand-embellished,
            <br />
            <span className="text-hj-gold-soft">made to be kept.</span>
          </p>
          <div className="mt-6 h-px w-24 bg-hj-gold" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
            Manage the ZOUQ 1, ZOUQ 2 and BY NAZISH ALI collections — products,
            imagery, orders and demand, all in one place.
          </p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
          Lahore · Pakistan
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-hj-cream px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <LogoMark size={44} />
          </div>
          <h1 className="mt-6 font-display text-3xl tracking-brand text-hj-ink lg:mt-0">
            HAJAR
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-hj-muted">
            Atelier admin sign in
          </p>

          <form className="mt-10 space-y-5" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@hajar.pk"
                className="mt-2 h-12 w-full rounded-sm border border-hj-border bg-white px-3.5 text-sm transition-colors focus:border-hj-gold focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.16em] text-hj-muted">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 h-12 w-full rounded-sm border border-hj-border bg-white px-3.5 text-sm transition-colors focus:border-hj-gold focus:outline-none"
              />
            </label>

            {error && <p className="text-xs text-hj-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-sm bg-hj-ink text-[11px] uppercase tracking-[0.18em] text-hj-gold-soft transition-colors hover:bg-hj-gold hover:text-hj-ink disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-[11px] leading-relaxed text-hj-muted">
            Credentials come from <code className="font-mono">ADMIN_EMAIL</code>{" "}
            and <code className="font-mono">ADMIN_PASSWORD</code> in{" "}
            <code className="font-mono">api/.env</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
