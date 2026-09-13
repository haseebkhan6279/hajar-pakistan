"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_FOCAL_DEFAULT, type HeroSlide } from "@/lib/data";
import { cn } from "@/lib/clsx";

const INTERVAL = 4500;

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

  const slide = slides[index];

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
      {slides.map((item, i) => {
        const active = i === index;
        return (
          <div
            key={item.image}
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1100ms] ease-out",
              active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              quality={85}
              style={{ objectPosition: item.focal ?? HERO_FOCAL_DEFAULT }}
              className="object-cover"
            />
          </div>
        );
      })}

      <Link
        href={slide.href}
        className="absolute inset-0 flex items-end justify-center px-6 pb-10 text-center md:items-end md:justify-end md:pb-12 md:pr-12 md:text-left"
      >
        <div className="text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.4)]">
          <p className="font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-light uppercase leading-[1.05] tracking-[0.18em]">
            {slide.headline.replace(/\.$/, "")}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/85">
            {slide.kicker.split("—")[0].trim()}
          </p>
        </div>
      </Link>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((item, i) => (
            <button
              key={item.image}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === index ? "bg-white" : "bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
