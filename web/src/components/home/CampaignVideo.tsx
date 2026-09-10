"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Full-bleed campaign film.
 *
 * The file is ~7 MB, so it is never part of the initial page weight: nothing is
 * fetched until the band scrolls into view, and playback stops again once it
 * leaves. Muted + playsInline so mobile browsers will autoplay it at all, and a
 * visible pause control because it starts on its own (WCAG 2.2.2).
 *
 * The mp4 itself must stay faststart — moov atom ahead of mdat. Encoded the
 * other way round, Safari cannot begin until it has downloaded all 6.8 MB,
 * which on an iPhone reads as the film simply not loading. If this file is
 * ever re-exported, run it through `ffmpeg -i in.mp4 -c copy -movflags
 * +faststart out.mp4` before committing it.
 *
 * The poster is a real frame from the film, so the band shows the shot while
 * the video is still arriving rather than an empty panel.
 */
export function CampaignVideo({
  src = "/media/hajar-campaign.mp4",
  eyebrow = "The film",
  title = "Hajar by Nazish Ali",
  body = "Shot on a Lahore balcony — the couture line in movement, as it is meant to be seen.",
  href = "/category/hajar-by-nazish-ali",
  cta = "Shop the couture line",
}: {
  src?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Only fetch and play while the band is actually on screen
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          void video.play().then(
            () => setPlaying(true),
            () => setPlaying(false)
          );
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [src, reduced]);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.src) video.src = src;
    if (video.paused) {
      void video.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      /*
        The file is 1920x1080, but the PICTURE inside it is a ~2.16:1
        cinematic crop with black bars baked into the top and bottom of every
        frame. So the container's 16:9 is a lie: matching it (aspect-video)
        showed the bars, and top-anchoring the crop parked the view directly
        on the upper one.

        2.35:1 is the fix. It is narrower than the real picture, so the band
        always crops at least 131px a side at 1920 — enough to swallow the
        ~95px bars with room spare — and because band and video both scale
        with width, that margin holds at every screen size. The crop stays
        centred, which is what keeps it symmetric over both bars.

        max-h only ever makes the band shorter, which crops more, which is
        also safe.

        Narrow screens keep a viewport-height band: a 2.35:1 box on a phone is
        only ~165px tall, far too short to carry the overlaid copy.
      */
      className="relative h-[70vh] min-h-[440px] w-full overflow-hidden bg-hj-sand md:aspect-[2.35/1] md:h-auto md:max-h-[80vh] md:min-h-0"
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster="/media/campaign-poster.jpg"
        aria-label={`${title} campaign film`}
        /* Centred, deliberately: the letterbox bars are symmetric, so an even
           crop takes the same amount off each one. Anchoring this to the top is
           what put a black band across the section. The poster is drawn with
           the same object-fit, so it crops identically. */
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Scrim weighted to the left, where the type sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-hj-ink/65 via-hj-ink/25 to-transparent" />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
          <div className="max-w-lg text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] text-hj-gold-soft drop-shadow-[0_2px_10px_rgba(10,10,10,0.6)]">
              {eyebrow}
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] text-white drop-shadow-[0_2px_20px_rgba(10,10,10,0.45)]">
              {title}
            </h2>
            <div className="rule-gold mx-auto mt-6 h-px w-20 md:mx-0" />
            <p className="mt-6 text-[15px] leading-relaxed text-white/80 drop-shadow-[0_2px_12px_rgba(10,10,10,0.5)]">
              {body}
            </p>
            <Link
              href={href}
              className="mt-9 inline-flex h-14 items-center border border-white bg-white px-9 text-xs uppercase tracking-[0.18em] text-hj-ink transition-colors duration-300 hover:border-hj-gold hover:bg-hj-gold hover:text-hj-ink"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Autoplaying media needs a visible control */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the film" : "Play the film"}
        className="absolute bottom-6 right-6 z-10 flex h-11 w-11 items-center justify-center border border-white/40 text-white/80 backdrop-blur-sm transition-colors hover:border-white hover:text-white"
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <rect x="4" y="3" width="3" height="10" fill="currentColor" />
            <rect x="9" y="3" width="3" height="10" fill="currentColor" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M5 3l8 5-8 5V3z" fill="currentColor" />
          </svg>
        )}
      </button>
    </section>
  );
}
