"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { gallery, garden, ring, type Media } from "@/content/play";

const TURN = 70; // degrees the ring turns while it scrolls out of view
const DRIFT = 13; // degrees per second the ring keeps turning on its own, clockwise
const ARRIVAL_SPIN = -210; // degrees each piece sweeps clockwise round the ring while it unfurls from the centre
const REST = -88; // where the first piece sits, measured from the +x axis (top of the ring)
const HOLD = 0.55; // seconds the pile sits in the middle before it opens

// Rounded so the server and the browser write identical transforms.
const round = (v: number) => Math.round(v * 10) / 10;

function Picture({ media, className = "" }: { media: Media; className?: string }) {
  if (media.kind === "image") {
    return <Image src={media.src} alt={media.alt} width={media.width} height={media.height} sizes="(min-width: 768px) 432px, 90vw" draggable={false} className={className} />;
  }
  return <video src={media.src} poster={media.poster} aria-label={media.alt} width={media.width} height={media.height} muted loop playsInline autoPlay preload="metadata" className={className} />;
}

// One piece on the ring. All the pieces begin as a pile in the middle, then unfurl outward in a clockwise spiral
// (each one a beat after the last) and settle into their places; after that the whole ring keeps turning.
function Orbiter({ media, index, progress, drift, radius, reduced }: { media: Media; index: number; progress: MotionValue<number>; drift: MotionValue<number>; radius: number; reduced: boolean }) {
  const base = REST + index * (360 / ring.length);
  const entry = useMotionValue(reduced ? 1 : 0);
  useEffect(() => {
    if (reduced) return;
    const controls = animate(entry, 1, { duration: 1.7, delay: HOLD + index * 0.07, ease: [0.16, 0.9, 0.28, 1] });
    return () => controls.stop();
  }, [entry, index, reduced]);

  const angle = useTransform([progress, drift], ([p, d]: number[]) => base + d + p * (reduced ? 0 : TURN));
  const swung = useTransform([angle, entry], ([a, e]: number[]) => a + (1 - e) * ARRIVAL_SPIN);
  const x = useTransform([swung, entry], ([a, e]: number[]) => round(Math.cos((a * Math.PI) / 180) * radius * e));
  const y = useTransform([swung, entry], ([a, e]: number[]) => round(Math.sin((a * Math.PI) / 180) * radius * 0.92 * e));
  const rotate = useTransform(swung, (a) => round(a + 90));
  const scale = useTransform(entry, [0, 1], [0.55, 1]);
  const size = radius * 0.62; // longest side of a piece
  const ratio = media.width / media.height;
  const w = ratio >= 1 ? size : size * ratio;
  const h = ratio >= 1 ? size / ratio : size;
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" style={{ width: `${w}px`, height: `${h}px`, margin: `${-h / 2}px 0 0 ${-w / 2}px` }}>
      <motion.div className="h-full w-full shadow-[0_6px_18px_rgba(0,0,0,0.16)]" style={{ x, y, rotate, scale }}>
        <Picture media={media} className="block h-full w-full object-cover" />
      </motion.div>
    </div>
  );
}

function Stage({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [radius, setRadius] = useState(250);
  const hint = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const drift = useMotionValue(0);
  // The ring never stops turning; it is paused for people who ask for less motion.
  useAnimationFrame((_, delta) => {
    if (!reduced) drift.set(drift.get() + (DRIFT * Math.min(delta, 50)) / 1000);
  });
  useEffect(() => {
    const fit = () => {
      setRadius(Math.max(110, Math.min(250, window.innerWidth * 0.3, window.innerHeight * 0.3)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div ref={ref} className="relative h-screen min-h-[560px] overflow-x-clip">
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {ring.map((m, i) => (
          <Orbiter key={m.src} media={m} index={i} progress={scrollYProgress} drift={drift} radius={radius} reduced={reduced} />
        ))}
      </div>
      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center">
        <h1 className="font-display text-[36px] font-normal leading-[1.1]">{garden.title}</h1>
        <motion.p className="mt-[2px] font-graphik text-[10px] text-muted" style={{ opacity: hint }}>
          {garden.hint}
        </motion.p>
      </div>
    </div>
  );
}

export default function Garden() {
  const reduced = useReducedMotion() ?? false;
  return (
    <>
      <Stage reduced={reduced} />
      <section className="mx-auto w-full max-w-[1328px] px-4 pb-[40px] md:px-[56px]">
        <p className="max-w-[760px] font-display text-[32px] font-normal leading-[1.3] md:text-[34px]">{garden.intro}</p>
        <div className="mt-[56px] columns-1 gap-[16px] sm:columns-2 lg:columns-3">
          {gallery.map((g, i) => (
            <motion.figure
              key={g.media.src}
              className="group relative mb-[16px] break-inside-avoid overflow-hidden rounded-[8px] bg-white"
              initial={reduced ? false : { opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1], delay: (i % 3) * 0.08 }}
            >
              <Picture media={g.media} className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]" />
              {g.caption && <figcaption className="absolute bottom-[10px] left-[10px] max-w-[calc(100%-20px)] rounded-full bg-white/90 px-[10px] py-[5px] font-graphik text-[11px] leading-[1.25] text-[#222] shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur">{g.caption}</figcaption>}
            </motion.figure>
          ))}
        </div>
      </section>
    </>
  );
}
