"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const COLORS = [
  { name: "Coral", value: "#FB5233" },
  { name: "Ink", value: "#1f1f1f" },
  { name: "Sky", value: "#2f7bff" },
  { name: "Sun", value: "#ffb800" },
  { name: "Leaf", value: "#2fae6b" },
] as const;
const SIZES = [
  { name: "Fine", value: 6 },
  { name: "Medium", value: 14 },
  { name: "Broad", value: 28 },
] as const;

type Pt = { x: number; y: number; w: number };
type Stroke = { color: string; pts: Pt[] };

// Paints a stroke as a chain of smoothed segments whose width follows the pointer's speed, like a loaded brush.
function paint(ctx: CanvasRenderingContext2D, stroke: Stroke, from = 0) {
  const { pts, color } = stroke;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (pts.length === 1) {
    ctx.beginPath();
    ctx.arc(pts[0].x, pts[0].y, pts[0].w / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  for (let i = Math.max(1, from); i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const m0 = i > 1 ? { x: (pts[i - 2].x + a.x) / 2, y: (pts[i - 2].y + a.y) / 2 } : a;
    const m1 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    ctx.lineWidth = (a.w + b.w) / 2;
    ctx.beginPath();
    ctx.moveTo(m0.x, m0.y);
    ctx.quadraticCurveTo(a.x, a.y, m1.x, m1.y);
    ctx.stroke();
  }
}

function BrushCursor({ color, pos }: { color: string; pos: { x: number; y: number } | null }) {
  if (!pos) return null;
  // The tip of the brush sits exactly on the pointer.
  return (
    <svg
      aria-hidden
      width="64"
      height="64"
      viewBox="0 0 64 64"
      className="pointer-events-none fixed left-0 top-0 z-[71]"
      style={{ transform: `translate(${pos.x - 6}px, ${pos.y - 58}px)`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}
    >
      <g transform="rotate(35 6 58)">
        <rect x="3" y="2" width="6" height="34" rx="3" fill="#caa46a" />
        <rect x="2.5" y="30" width="7" height="10" rx="1.5" fill="#c9ccd1" />
        <path d="M2.5 40 L9.5 40 C9.5 50 7.5 56 6 60 C4.5 56 2.5 50 2.5 40 Z" fill={color} />
      </g>
    </svg>
  );
}

function DrawingLayer({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const current = useRef<Stroke | null>(null);
  const last = useRef<{ x: number; y: number; t: number; w: number } | null>(null);
  const [color, setColor] = useState<string>(COLORS[0].value);
  const [size, setSize] = useState<number>(SIZES[1].value);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [hint, setHint] = useState(true);
  const [count, setCount] = useState(0); // number of strokes, so Undo/Clear know when they are available
  const [leaving, setLeaving] = useState(false);

  const redraw = useCallback(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    for (const s of strokes.current) paint(ctx, s);
  }, []);

  const fit = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(window.innerWidth * dpr);
    c.height = Math.round(window.innerHeight * dpr);
    c.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }, [redraw]);

  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  // The page behind must not scroll or run its own wheel/touch gestures while someone is painting.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const stop = (e: Event) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };
    const opts = { passive: false } as const;
    const events = ["wheel", "touchstart", "touchmove", "touchend"] as const;
    events.forEach((n) => el.addEventListener(n, stop, opts));
    return () => events.forEach((n) => el.removeEventListener(n, stop));
  }, []);

  const undo = useCallback(() => {
    strokes.current.pop();
    setCount(strokes.current.length);
    redraw();
  }, [redraw]);
  const clear = useCallback(() => {
    strokes.current = [];
    setCount(0);
    redraw();
  }, [redraw]);

  const finish = useCallback(() => {
    setLeaving(true);
    window.setTimeout(onDone, 380);
  }, [onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => setHint(false), 4200);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [finish, undo]);

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setHint(false);
    const w = e.pointerType === "pen" && e.pressure > 0 ? size * (0.5 + e.pressure) : size;
    current.current = { color, pts: [{ x: e.clientX, y: e.clientY, w }] };
    last.current = { x: e.clientX, y: e.clientY, t: performance.now(), w };
    strokes.current.push(current.current);
    const ctx = canvas.current?.getContext("2d");
    if (ctx) paint(ctx, current.current);
    setCount(strokes.current.length);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setPos({ x: e.clientX, y: e.clientY });
    const s = current.current;
    const prev = last.current;
    if (!s || !prev) return;
    const now = performance.now();
    const d = Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
    if (d < 1.5) return;
    const speed = d / Math.max(1, now - prev.t); // px per ms
    const target = e.pointerType === "pen" && e.pressure > 0 ? size * (0.5 + e.pressure) : size * Math.min(1.15, Math.max(0.45, 1.2 - speed * 0.35));
    const w = prev.w + (target - prev.w) * 0.35; // eased, so the stroke swells and thins smoothly
    s.pts.push({ x: e.clientX, y: e.clientY, w });
    last.current = { x: e.clientX, y: e.clientY, t: now, w };
    const ctx = canvas.current?.getContext("2d");
    if (ctx) paint(ctx, s, s.pts.length - 1);
  };
  const up = () => {
    current.current = null;
    last.current = null;
  };

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[70] transition-opacity duration-[380ms]"
      style={{ opacity: leaving ? 0 : 1 }}
      role="dialog"
      aria-label="Drawing mode"
    >
      <canvas
        ref={canvas}
        className="absolute inset-0 h-full w-full touch-none"
        style={{ cursor: "none" }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={() => setPos(null)}
      />
      <BrushCursor color={color} pos={pos} />

      <p
        className="pointer-events-none absolute left-1/2 top-[88px] -translate-x-1/2 rounded-full bg-[#1f1f1f] px-[18px] py-[9px] font-body text-[15px] text-white transition-opacity duration-500"
        style={{ opacity: hint ? 0.92 : 0 }}
      >
        Go on, draw something. Esc when you&rsquo;re done.
      </p>

      <div className="absolute bottom-[28px] left-1/2 flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[14px] overflow-x-auto rounded-full bg-white px-[16px] py-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-[8px]" role="radiogroup" aria-label="Paint colour">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={color === c.value}
              aria-label={c.name}
              onClick={() => setColor(c.value)}
              className="h-[26px] w-[26px] shrink-0 rounded-full transition-transform hover:scale-110"
              style={{ background: c.value, boxShadow: color === c.value ? `0 0 0 3px #fff, 0 0 0 5px ${c.value}` : "inset 0 0 0 1px rgba(0,0,0,0.08)" }}
            />
          ))}
        </div>
        <span className="h-[22px] w-px shrink-0 bg-black/10" />
        <div className="flex items-center gap-[6px]" role="radiogroup" aria-label="Brush size">
          {SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={size === s.value}
              aria-label={s.name}
              onClick={() => setSize(s.value)}
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5"
              style={{ background: size === s.value ? "rgba(0,0,0,0.08)" : undefined }}
            >
              <span className="rounded-full bg-[#1f1f1f]" style={{ width: 4 + s.value / 2.4, height: 4 + s.value / 2.4 }} />
            </button>
          ))}
        </div>
        <span className="h-[22px] w-px shrink-0 bg-black/10" />
        <button type="button" onClick={undo} disabled={!count} className="shrink-0 font-body text-[15px] font-medium text-[#1f1f1f] disabled:opacity-30">
          Undo
        </button>
        <button type="button" onClick={clear} disabled={!count} className="shrink-0 font-body text-[15px] font-medium text-[#1f1f1f] disabled:opacity-30">
          Clear
        </button>
        <button type="button" onClick={finish} className="shrink-0 rounded-full bg-brand px-[16px] py-[7px] font-body text-[15px] font-medium text-white">
          Done
        </button>
      </div>
    </div>
  );
}

// The pot of brushes in the hero. Picking it up turns the whole screen into a canvas that visitors can paint on.
export default function PaintBrushes({ className = "" }: { className?: string }) {
  const [drawing, setDrawing] = useState(false);
  const done = useCallback(() => setDrawing(false), []);
  return (
    <>
      <button
        type="button"
        aria-label="Pick up a paintbrush and draw on the page"
        onClick={() => setDrawing(true)}
        className={`${className} group block h-[160px] w-[100px] cursor-pointer transition-transform duration-300 hover:scale-[1.05]`}
        style={{ opacity: drawing ? 0.35 : 1 }}
      >
        <Image src="/images/home/hero/paintbrush.png" alt="" width={456} height={731} priority draggable={false} className="h-full w-full drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" />
      </button>
      {drawing && createPortal(<DrawingLayer onDone={done} />, document.body)}
    </>
  );
}
