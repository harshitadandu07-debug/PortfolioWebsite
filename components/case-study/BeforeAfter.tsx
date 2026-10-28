"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Block } from "@/content/case-studies/types";
import RichText from "./RichText";
import { Child } from "./CanvasChildView";
import { GRAB_DELAY, HandsStage, STAGE, useToggleHands } from "./ToggleHands";

type ToggleBlock = Extract<Block, { kind: "toggle" }>;

// Timing and colors come from the Figma "GrabToggle" animation (2s demo loop), converted to seconds.
// Each value is [on, off]: the thumb slides, then its color and the track color follow.
const COLORS = {
  track: { off: "#DEDEDE", on: "#D2F8FF" },
  thumb: { off: "#FFFFFF", on: "#0089EB" },
};
const COLOR_EASE = [0.5, 0, 0.5, 1] as const;
// Both directions follow the Figma timeline: the right hand drags the circle on, the left hand pulls it back off.
const TIMING = {
  on: { slide: 0.44, ease: [0.67, 0, 0.77, 1] as const, track: { delay: 0.016, duration: 0.474 }, thumb: { delay: 0.169, duration: 0.31 } },
  off: { slide: 0.482, ease: [0.67, 0, 0.77, 1] as const, track: { delay: 0.007, duration: 0.474 }, thumb: { delay: 0.17, duration: 0.273 } },
};

export default function BeforeAfter({ block }: { block: ToggleBlock }) {
  const [after, setAfter] = useState(false);
  const busy = useRef(false);
  const reduce = useReducedMotion();
  const hands = useToggleHands();

  // Without motion the switch flips at once. Otherwise the hand reaches in first and the state
  // flips when it grabs the circle (GRAB_DELAY); turning off pulls the circle back from the left.
  const go = (next: boolean) => {
    if (busy.current || next === after) return;
    if (reduce) return setAfter(next);
    busy.current = true;
    hands.play(next, travel / (track.w / STAGE.w));
    const grab = next ? GRAB_DELAY.on : GRAB_DELAY.off;
    setTimeout(() => setAfter(next), grab * 1000);
    setTimeout(() => (busy.current = false), (next ? 850 : 1250));
  };
  const { labels, track, thumb, states } = block;
  const s = after ? states.after : states.before;
  const travel = states.after.thumbX - states.before.thumbX;
  const t = after ? TIMING.on : TIMING.off;
  const dur = (n: number) => (reduce ? 0 : n);
  const delay = (n: number) => (reduce ? 0 : n);
  return (
    <div className="relative" style={{ height: block.h }}>
      <motion.button
        type="button"
        role="switch"
        aria-checked={after}
        aria-label="Toggle before and after"
        onClick={() => go(!after)}
        className="absolute cursor-pointer p-0"
        style={{ left: track.x, top: track.y, width: track.w, height: track.h, borderRadius: track.radius }}
        initial={false}
        animate={{ backgroundColor: after ? COLORS.track.on : COLORS.track.off }}
        transition={{ duration: dur(t.track.duration), delay: delay(t.track.delay), ease: COLOR_EASE }}
      >
        {!reduce && <HandsStage track={track}>{hands.back}</HandsStage>}
        <motion.span
          className="absolute"
          style={{ left: states.before.thumbX - track.x, top: thumb.y - track.y, width: thumb.w, height: thumb.h, borderRadius: thumb.radius }}
          initial={false}
          animate={{ x: after ? travel : 0, backgroundColor: after ? COLORS.thumb.on : COLORS.thumb.off }}
          transition={{
            x: { duration: dur(t.slide), ease: t.ease },
            backgroundColor: { duration: dur(t.thumb.duration), delay: delay(t.thumb.delay), ease: COLOR_EASE },
          }}
        />
        {!reduce && <HandsStage track={track}>{hands.front}</HandsStage>}
      </motion.button>
      {labels.map((l, i) => (
        <button key={i} type="button" onClick={() => go(i === 1)} className="absolute cursor-pointer p-0" style={{ left: l.x, top: l.y, width: l.w, height: l.h }}>
          <RichText html={l.html} style={s.labelStyles[i]} className="m-0 whitespace-nowrap" />
        </button>
      ))}
      {s.children.map((c, j) => (
        <Child key={`${after}-${j}`} c={c} />
      ))}
    </div>
  );
}
