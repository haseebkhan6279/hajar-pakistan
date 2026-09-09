"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_FOCAL_DEFAULT, type HeroSlide } from "@/lib/data";
import { cn } from "@/lib/clsx";

/** Hold per slide. The 1.1s crossfade runs inside this, so it is the full cycle. */
const INTERVAL = 3000;

/**
 * Full-bleed campaign hero.
 *
 * The desktop frame is capped at 56.25vw — a 16:9 box — but on any window
 * shorter than it is wide the `100vh - 9.5rem` term wins instead, and the band
 * ends up far wider than that. On 1920x900 it is 2.57:1, which cuts 30% off a
 * 16:9 shot and 42% off a 3:2 one.
 *
 * So the crop is always significant, and which end of the photo it takes has
 * to be chosen per slide rather than assumed — see `HeroSlide.focal`.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, go, slides.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Campaign"
      className="relative h-[64vh] min-h-[420px] w-full overflow-hidden bg-hj-sand lg:h-[min(calc(100vh-9.5rem),56.25vw)] lg:max-h-[860px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
        touchStart.current = null;
      }}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.image}
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1100ms] ease-out",
              active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              quality={85}
              /* Anchored per slide — see HeroSlide.focal. It has to be an
                 inline style rather than a Tailwind class: the value is data,
                 and Tailwind only emits classes it can see at build time. */
              style={{ objectPosition: slide.focal ?? HERO_FOCAL_DEFAULT }}
              className="object-cover"
            />
            {/* Scrim only along the bottom-left, where the type sits */}
            <div className="absolute inset-0 bg-gradient-to-t from-hj-ink/70 via-hj-ink/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-hj-ink/45 via-transparent to-transparent" />
          </div>
        );
      })}

      {/* Copy */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-[1500px] px-6 pb-14 md:px-12 md:pb-20">
          <div className="max-w-xl animate-rise">
            <p className="text-[10px] uppercase tracking-[0.3em] text-hj-gold-soft drop-shadow-[0_2px_10px_rgba(10,10,10,0.7)]">
              {slides[index].eyebrow}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.75rem)] font-light leading-[1.02] text-white drop-shadow-[0_2px_24px_rgba(10,10,10,0.5)]">
              {slides[index].headline}
            </h1>
            {slides[index].standfirst && (
              <p className="mt-5 max-w-[36ch] text-[15px] leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(10,10,10,0.6)] md:text-base">
                {slides[index].standfirst}
              </p>
            )}
            <div key={slides[index].kicker} className="animate-rise">
              <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-white/85 drop-shadow-[0_2px_12px_rgba(10,10,10,0.6)]">
                {slides[index].kicker}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                key={slides[index].href}
                href={slides[index].href}
                className="animate-rise inline-flex items-center border border-white bg-white px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-hj-ink transition-colors duration-300 hover:border-hj-gold hover:bg-hj-gold hover:text-hj-ink"
              >
                {slides[index].cta}
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center border border-white/50 px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-hj-ink"
              >
                Shop all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white md:left-6"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white md:right-6"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
