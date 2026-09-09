"use client";

import { useRef } from "react";
import Image from "next/image";
import type { InstagramPost } from "@/lib/catalog";
import { SITE } from "@/lib/seo";
import { cn } from "@/lib/clsx";

/** The glyph from the footer, at grid scale. */
const GLYPH =
  "M4 2.6h12A1.4 1.4 0 0 1 17.4 4v12a1.4 1.4 0 0 1-1.4 1.4H4A1.4 1.4 0 0 1 2.6 16V4A1.4 1.4 0 0 1 4 2.6Zm6 4.6a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.3-1.5a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Z";

/** Most tiles the grid will draw. Beyond this it stops being a taster. */
const MAX_TILES = 8;

/**
 * Columns for a given number of tiles. Capped at four: six-across made each
 * post a thumbnail, and the point of the band is that the work is legible.
 */
function columnsFor(count: number): string {
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-2 sm:grid-cols-3";
  return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
}

/**
 * One post.
 *
 * A reel is a real `<video>` with the still as its poster: `preload="none"`
 * means nothing is fetched until the pointer arrives, so a row of four costs
 * no bandwidth on load. Touch devices never fire hover, so they keep the
 * poster and the reel badge — which is the right outcome, since a tap should
 * open Instagram rather than start playback in place.
 */
function Tile({ post }: { post: InstagramPost }) {
  const video = useRef<HTMLVideoElement>(null);

  function play() {
    // Autoplay can still be refused (data saver, low power mode); a silent
    // failure just leaves the poster up, which is a fine outcome.
    void video.current?.play().catch(() => {});
  }

  function stop() {
    const el = video.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }

  return (
    <li>
      <a
        href={post.postUrl || SITE.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={post.video ? play : undefined}
        onMouseLeave={post.video ? stop : undefined}
        onFocus={post.video ? play : undefined}
        onBlur={post.video ? stop : undefined}
        /*
          4:5 — Instagram's own portrait ratio. The tiles were square, which
          cut roughly a third off vertical posts and took the heads with it.
        */
        className="group relative block aspect-[4/5] overflow-hidden bg-hj-sand"
      >
        <Image
          src={post.image}
          alt={post.caption || `${SITE.name} on Instagram`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          /* Top-anchored: a 9:16 reel still loses height in a 4:5 frame, and
             what it loses should be floor, not face. */
          className="card-img object-cover object-top"
        />

        {post.video && (
          <video
            ref={video}
            src={post.video}
            poster={post.image}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        )}

        {/* Reel badge — only where there is something to play */}
        {post.video && (
          <span
            aria-hidden
            className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center bg-hj-ink/75 text-hj-gold-soft transition-opacity duration-300 group-hover:opacity-0"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3 fill-current">
              <path d="M3 1.8v8.4L10 6 3 1.8Z" />
            </svg>
          </span>
        )}

        {/*
          A gradient from the base rather than a flat scrim over the whole
          tile: the photograph stays readable and only the caption end is
          darkened, which is the same treatment the hero uses.
        */}
        <span
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col justify-end",
            "bg-gradient-to-t from-hj-ink/80 via-hj-ink/10 to-transparent p-3.5",
            "opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100 group-focus-visible:opacity-100"
          )}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-hj-gold-soft" aria-hidden>
            <path d={GLYPH} />
          </svg>
          {post.caption && (
            <span className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/90">
              {post.caption}
            </span>
          )}
        </span>

        {/* Hairline that warms to gold on hover — the tile's only border */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 border border-hj-border transition-colors duration-300 group-hover:border-hj-gold"
        />
      </a>
    </li>
  );
}

/**
 * Curated Instagram grid.
 *
 * Tiles come from the dashboard, not from Instagram — the Basic Display API
 * was shut down in December 2024 and its replacement needs a Meta app and a
 * token that expires every 60 days.
 *
 * It was a gapless hairline mosaic of squares. The squares cropped every
 * vertical post to its middle third, and at six across each one was too small
 * to read. Now: 4:5 frames, four across, with air between them.
 */
export function InstagramGrid({ posts }: { posts: InstagramPost[] }) {
  if (posts.length === 0) return null;

  const shown = posts.slice(0, MAX_TILES);

  return (
    <section className="border-t border-hj-border bg-white py-14 md:py-20">
      <header className="mx-auto max-w-2xl px-4 text-center">
        <p className="eyebrow">Instagram</p>
        <h2 className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] uppercase tracking-[0.16em] text-hj-ink">
          {SITE.instagramHandle}
        </h2>
        <div className="rule-gold mx-auto mt-4 h-px w-20" />
        <p className="mt-4 text-[15px] text-hj-muted">
          The work as it leaves the atelier — fittings, detail and finished
          pieces.
        </p>
      </header>

      <ul
        className={cn(
          "mx-auto mt-11 grid gap-3 px-4 md:gap-4 md:px-8",
          "max-w-[1500px]",
          columnsFor(shown.length)
        )}
      >
        {shown.map((post) => (
          <Tile key={post.id} post={post} />
        ))}
      </ul>

      <div className="mt-12 text-center">
        <a
          href={SITE.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 border border-hj-ink px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-hj-ink transition-colors duration-300 hover:bg-hj-ink hover:text-hj-gold-soft"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
            <path d={GLYPH} />
          </svg>
          Follow {SITE.instagramHandle}
        </a>
      </div>
    </section>
  );
}
