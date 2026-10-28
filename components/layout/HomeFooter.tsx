"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { hero } from "@/content/home";
import AnimatedFooter from "@/features/animated-footer/components/AnimatedFooter";
import "./home-footer.css";

// Two-step footer. The first scroll just ends the page on "Made with <3": the cream page with its curved,
// curled-corner edge over a short blue strip. The blue footer is fixed under the page.
// A second, separate push at the very end (wheel or touch) stretches the page up against resistance; pull
// far enough and it stays lifted, and the animated contact footer is there in the blue beneath it. Let go early
// and it springs back; scrolling up closes it. It only ever stretches up.
const BASE = 27; // px of blue under the curved edge at the end of the page (the original footer height)
const SOFT = 200; // px the page can be pulled up before it commits, with resistance
const COMMIT = 240; // how hard the pull has to be (before resistance) to stay open
const GESTURE_GAP = 200; // ms without input that separates "the first scroll" from "scrolling again"
const CURVE_VW = 9; // height of the curve artwork (4096x368) as a share of the viewport width, rounded up
const FOOTER_PAD = { bottom: 72, top: 78 }; // room under the scene for "Made with <3", and between the paper edge and the scene
const CONTACT_HASH = "#v2contact"; // the nav's "Contact" link: jumps to the end and opens the footer

// Returns how far (px) the page is currently lifted by the pull. `openPx` is how far it lifts when opened.
function usePageLift(enabled: boolean, openPx: number, onOpenChange: (open: boolean) => void) {
  const target = useMotionValue(0);
  const lift = useSpring(target, { stiffness: 210, damping: 24, mass: 0.6 });
  const openHeight = useRef(openPx);
  const isOpen = useRef(false);
  const notify = useRef(onOpenChange);
  useEffect(() => {
    notify.current = onOpenChange;
    openHeight.current = openPx;
    if (isOpen.current) target.set(openPx); // the scene resized while open: follow it
  }, [openPx, onOpenChange, target]);

  useEffect(() => {
    if (!enabled) return;
    let pull = 0; // how hard the user is pushing, before resistance
    let armed = false; // true once a fresh gesture starts while already at the end
    let lastInput = 0;
    let touchY: number | null = null;
    let release: number | undefined;
    const root = document.documentElement;
    const atEnd = () => window.scrollY + window.innerHeight >= root.scrollHeight - 1;
    const setOpen = (value: boolean) => {
      if (isOpen.current === value) return;
      isOpen.current = value;
      notify.current(value);
    };
    const letGo = () => {
      pull = 0;
      if (!isOpen.current) target.set(0);
    };
    const open = () => {
      setOpen(true);
      target.set(openHeight.current);
    };
    const close = () => {
      setOpen(false);
      pull = 0;
      target.set(0);
    };
    const push = (delta: number) => {
      if (isOpen.current) return;
      pull = Math.min(Math.max(pull + delta, 0), 1200);
      if (pull >= COMMIT) return open();
      target.set(SOFT * (1 - Math.exp(-pull / 320))); // diminishing returns
      window.clearTimeout(release);
      release = window.setTimeout(letGo, 140);
    };
    // Whether this input starts a new gesture, i.e. the user paused since the last one.
    const fresh = () => {
      const now = performance.now();
      const isNew = now - lastInput > GESTURE_GAP;
      lastInput = now;
      return isNew;
    };
    // Scrolling a long message inside the form must not count as scrolling the page.
    const inScrollableText = (e: Event) => e.target instanceof HTMLTextAreaElement && e.target.scrollTop > 0;
    const onWheel = (e: WheelEvent) => {
      const isNew = fresh();
      if (inScrollableText(e)) return;
      // The browser may already have scrolled the page up by the time this runs, so closing can't depend on atEnd().
      if (e.deltaY < 0 && isOpen.current) return close();
      if (!atEnd()) {
        armed = false;
        return;
      }
      if (e.deltaY < 0) return push(e.deltaY);
      if (isNew) armed = true; // arriving at the end in the middle of a scroll never arms it
      if (armed) push(e.deltaY * 0.6);
    };
    // The nav's "Contact" link jumps to the end with this hash in the URL: that opens the footer straight away.
    const openFromHash = () => {
      if (window.location.hash !== CONTACT_HASH || !atEnd()) return;
      window.history.replaceState(null, "", window.location.pathname + window.location.search); // so scrolling back down later does not re-open it
      open();
    };
    const onScroll = () => {
      if (isOpen.current && !atEnd()) return close(); // any way of leaving the end (keys, scrollbar) closes it too
      openFromHash();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      armed = atEnd(); // a finger that lands while already at the end is a new gesture
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      if (inScrollableText(e)) return;
      if (dy < 0 && isOpen.current) return close();
      if (dy < 0) return push(dy * 0.9);
      if (armed && atEnd()) push(dy * 0.9);
    };
    const onTouchEnd = () => {
      touchY = null;
      armed = false;
      window.clearTimeout(release);
      letGo();
    };
    // The browser's own bounce would stack on top of this one.
    const previous = root.style.overscrollBehaviorY;
    root.style.overscrollBehaviorY = "none";
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    const landed = window.setTimeout(openFromHash, 600); // arriving on the page with the hash already in the URL
    return () => {
      window.clearTimeout(release);
      window.clearTimeout(landed);
      root.style.overscrollBehaviorY = previous;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [enabled, target]);
  return lift;
}

export default function HomeFooter({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [sceneH, setSceneH] = useState(640); // the animated footer reports its real height once it has measured itself
  const [viewportH, setViewportH] = useState(900);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    const raf = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", update);
    };
  }, []);

  const openPx = sceneH + FOOTER_PAD.bottom + FOOTER_PAD.top;
  const lift = usePageLift(!reduce, openPx, setIsOpen);
  const pageY = useTransform(lift, (v) => -v);
  const footer = (
    <AnimatedFooter tone="light" maxHeight={Math.max(320, viewportH - FOOTER_PAD.bottom - FOOTER_PAD.top - 40)} onHeightChange={setSceneH} />
  );

  // Reduced motion: the page never lifts, so the footer counts as open and stays reachable. (The markup is the same
  // for everyone, so server and client agree; home-footer.css turns the reveal into a plain section for these users.)
  useEffect(() => {
    if (reduce) queueMicrotask(() => setIsOpen(true));
  }, [reduce]);

  return (
    <>
      {/* Everything above the fixed blue. Opaque, so the blue only shows once the curved edge lifts. */}
      <motion.div className="relative z-10" style={{ y: pageY }}>
        <div className="bg-cream pb-[36px]">{children}</div>
        {/* The page's curved edge. Its lower half is transparent, so the fixed blue shows through it. The shadow
            falls only below the paper (the clip drops anything above the edge); -1px hides a seam. */}
        <div className="hf-curve -mt-px" style={{ filter: "drop-shadow(0 10px 12px rgba(0, 0, 0, 0.28))", clipPath: "inset(0 0 -80px 0)" }}>
          <Image src="/images/shared/footer-curve.png" alt="" width={4096} height={368} sizes="100vw" className="block h-auto w-full" />
        </div>
        {/* The blue strip the page ends on. */}
        <div className="hf-curve" aria-hidden style={{ height: BASE }} />
        <div id="v2contact" aria-hidden className="h-px" />
      </motion.div>

      <div className="hf-blue fixed inset-x-0 bottom-0 z-0 overflow-hidden bg-brand" style={{ height: `calc(${BASE + openPx}px + ${CURVE_VW}vw)` }}>
        {/* The animated footer. Hidden behind the page until it opens, so it must not be reachable by keyboard until then. */}
        <div className="hf-scene absolute inset-x-0 px-4" style={{ bottom: FOOTER_PAD.bottom }} inert={!isOpen} aria-hidden={!isOpen}>
          {footer}
        </div>
        <p className="hf-made absolute -bottom-[5px] left-[max(0px,calc((100%-1200px)/2))] font-script text-[40px] leading-[48px] text-white">Made with &lt;3</p>
        <div className="hf-links absolute bottom-[14px] right-[max(16px,calc((100%-1200px)/2))] flex gap-5 text-[15px] font-semibold text-white">
          <a href={hero.linkedin} className="underline-offset-4 hover:underline">
            LinkedIn
          </a>
          <a href={hero.email} className="underline-offset-4 hover:underline">
            Email
          </a>
        </div>
      </div>
    </>
  );
}
