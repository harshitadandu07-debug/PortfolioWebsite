"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import "./home-theme.css";

// A cord hanging from the top-left corner of the homepage. Pull it down and let go: it springs and swings,
// and the page switches between light and dark. The cord is a small verlet rope (points held a fixed distance apart).
const POINTS = 15;
const SEGMENT = 9; // px between points, so the rope is (POINTS - 1) * SEGMENT = 126px long
const REST = (POINTS - 1) * SEGMENT;
const MAX_PULL = 74; // how far past its rest length the bead can be dragged
const TRIGGER = 34; // pull at least this far past rest, then let go, to switch themes
const STEP = 1 / 60;
const STORAGE_KEY = "home-theme";
const ATTR = "data-home-theme";

const OX = 30; // the rope's anchor inside the svg

type P = { x: number; y: number; px: number; py: number };

const makeRope = (): P[] => Array.from({ length: POINTS }, (_, i) => ({ x: 0, y: i * SEGMENT, px: 0, py: i * SEGMENT }));

// A smooth curve through the rope's points.
function toPath(pts: P[], ox: number) {
  let d = `M ${pts[0].x + ox} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2 + ox;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x + ox} ${pts[i].y} ${mx} ${my}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last.x + ox} ${last.y}`;
}

const INITIAL_PATH = toPath(makeRope(), OX);

export default function ThemeCord() {
  const reduced = useReducedMotion() ?? false;
  const [dark, setDark] = useState(false);
  const rope = useRef<P[]>(makeRope());
  const line = useRef<SVGPathElement>(null);
  const bead = useRef<SVGGElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const acc = useRef(0);

  // Apply the saved choice, and leave the other pages alone when the homepage unmounts.
  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem(STORAGE_KEY) === "dark";
    } catch {}
    const root = document.documentElement;
    if (saved) root.setAttribute(ATTR, "dark");
    else root.removeAttribute(ATTR);
    queueMicrotask(() => setDark(saved));
    return () => root.removeAttribute(ATTR);
  }, []);

  const draw = useCallback(() => {
    const pts = rope.current;
    line.current?.setAttribute("d", toPath(pts, OX));
    const end = pts[pts.length - 1];
    bead.current?.setAttribute("transform", `translate(${end.x + OX} ${end.y})`);
  }, []);

  const simulate = useCallback(() => {
    const pts = rope.current;
    const grab = drag.current;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      const vx = (p.x - p.px) * 0.985;
      const vy = (p.y - p.py) * 0.985;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + 0.55; // gravity
    }
    for (let k = 0; k < 14; k++) {
      pts[0].x = 0;
      pts[0].y = 0;
      if (grab) {
        const end = pts[pts.length - 1];
        end.x = grab.x;
        end.y = grab.y;
      }
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const diff = (dist - SEGMENT) / dist / 2;
        const free = i === 0 ? 0 : 1; // the anchor never moves
        a.x += dx * diff * (free ? 1 : 0);
        a.y += dy * diff * (free ? 1 : 0);
        b.x -= dx * diff * (free ? 1 : 2);
        b.y -= dy * diff * (free ? 1 : 2);
      }
    }
  }, []);

  // The animation loop runs only while the rope is moving, then sleeps.
  const tick = useRef<(now: number) => void>(() => {});
  useEffect(() => {
    tick.current = (now: number) => {
      acc.current += Math.min(0.05, (now - last.current) / 1000);
      last.current = now;
      while (acc.current >= STEP) {
        simulate();
        acc.current -= STEP;
      }
      draw();
      const end = rope.current[rope.current.length - 1];
      const moving = Math.abs(end.x - end.px) + Math.abs(end.y - end.py) > 0.03 || Math.abs(end.x) > 0.4;
      if (drag.current || moving) raf.current = requestAnimationFrame((t) => tick.current(t));
      else raf.current = 0;
    };
  }, [draw, simulate]);

  const wake = useCallback(() => {
    if (raf.current) return;
    last.current = performance.now();
    raf.current = requestAnimationFrame((t) => tick.current(t));
  }, []);

  useEffect(() => {
    draw();
    const frame = raf;
    return () => cancelAnimationFrame(frame.current);
  }, [draw]);

  const apply = useCallback((next: boolean) => {
    const root = document.documentElement;
    root.classList.add("ht-fade"); // colours ease over, but only for this change, never on load
    if (next) root.setAttribute(ATTR, "dark");
    else root.removeAttribute(ATTR);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {}
    window.setTimeout(() => root.classList.remove("ht-fade"), 700);
    setDark(next);
  }, []);

  const tug = useCallback(() => {
    const end = rope.current[rope.current.length - 1];
    end.py = end.y - 16; // a downward flick
    end.px = end.x + (Math.random() > 0.5 ? 3 : -3);
    wake();
  }, [wake]);

  const toggle = useCallback(() => {
    apply(!dark);
    if (!reduced) tug();
  }, [apply, dark, reduced, tug]);

  const point = (e: React.PointerEvent) => {
    const r = svg.current!.getBoundingClientRect();
    const x = e.clientX - r.left - OX;
    const y = e.clientY - r.top;
    const d = Math.hypot(x, y);
    const max = REST + MAX_PULL;
    return d > max ? { x: (x / d) * max, y: (y / d) * max } : { x, y: Math.max(y, 20) };
  };

  const down = (e: React.PointerEvent<SVGGElement>) => {
    if (reduced) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = point(e);
    wake();
  };
  const move = (e: React.PointerEvent<SVGGElement>) => {
    if (drag.current) drag.current = point(e);
  };
  const up = (e: React.PointerEvent<SVGGElement>) => {
    const grab = drag.current;
    if (!grab) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (Math.hypot(grab.x, grab.y) - REST > TRIGGER) apply(!dark);
    wake();
  };

  return (
    <svg
      ref={svg}
      aria-hidden={false}
      width={OX * 2}
      height={REST + MAX_PULL + 24}
      className="ht-cord pointer-events-none fixed top-0 z-40 select-none"
      style={{ left: "calc(max(20px, 50% - 600px) + 19px)", color: "var(--cord)" }}
    >
      <path ref={line} d={INITIAL_PATH} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <g
        ref={bead}
        transform={`translate(${OX} ${REST})`}
        role="button"
        tabIndex={0}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
        className="ht-bead pointer-events-auto cursor-grab touch-none outline-none active:cursor-grabbing"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClick={(e) => {
          if (e.detail === 0 || reduced) toggle(); // keyboard activation, or any click when dragging is off
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <circle r="18" fill="transparent" />
        <rect x="-3" y="-2" width="6" height="14" rx="3" fill="currentColor" />
        <circle cy="14" r="5" fill="currentColor" />
        <circle className="ht-focus" r="17" fill="none" strokeWidth="2" />
      </g>
    </svg>
  );
}
