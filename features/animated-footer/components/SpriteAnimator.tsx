"use client";

import Image from "next/image";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { SpriteFrame, SpriteSequence } from "../utils/animationConfig";

type Props = {
  sequence: SpriteSequence;
  /** Changing this restarts the sequence from its first frame (use the animation's name). */
  animationKey: string;
  width: number;
  height: number;
  playing?: boolean;
  /** Multiplies every frame's duration (e.g. 1.6 to slow down). Can change while playing; pass a motion value to change it every frame. */
  durationScale?: number | MotionValue<number>;
  /** Fires whenever the visible frame changes. */
  onFrame?: (index: number, frame: SpriteFrame) => void;
  /** Fires once when a non-looping sequence has shown its last frame for its full duration. The last frame stays up. */
  onComplete?: () => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * Plays a list of pre-rendered frames. Every frame of the sequence is mounted and stacked, and only the current
 * one is visible, so switching frames never waits on the network or decoding and never moves anything.
 */
export default function SpriteAnimator({ sequence, animationKey, width, height, playing = true, durationScale = 1, onFrame, onComplete, className, style }: Props) {
  // The frame index is stored with the animation it belongs to, so switching animations starts from frame 0 without a reset effect.
  const [state, setState] = useState({ key: animationKey, index: 0 });
  const index = state.key === animationKey ? state.index : 0;
  const scale = useRef<number | MotionValue<number>>(durationScale);
  const frameCb = useRef(onFrame);
  const doneCb = useRef(onComplete);
  const seq = useRef(sequence);
  useEffect(() => {
    scale.current = durationScale;
    frameCb.current = onFrame;
    doneCb.current = onComplete;
    seq.current = sequence;
  });

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let i = 0;
    let shownAt = performance.now();
    frameCb.current?.(0, seq.current.frames[0]);
    const tick = (now: number) => {
      const frames = seq.current.frames;
      const sc = () => (typeof scale.current === "number" ? scale.current : scale.current.get());
      let dur = frames[i].ms * sc();
      while (now - shownAt >= dur) {
        shownAt += dur;
        if (i === frames.length - 1) {
          if (!seq.current.loop) {
            doneCb.current?.();
            return; // hold the last frame
          }
          i = 0;
        } else i++;
        setState({ key: animationKey, index: i });
        frameCb.current?.(i, frames[i]);
        dur = frames[i].ms * sc();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animationKey, playing]);

  const unique = useMemo(() => [...new Set(sequence.frames.map((f) => f.src))], [sequence]);
  const current = sequence.frames[Math.min(index, sequence.frames.length - 1)].src;
  return (
    <div className={className} style={{ position: "relative", width, height, ...style }}>
      {unique.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={width}
          height={height}
          unoptimized
          loading="eager"
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", visibility: src === current ? "visible" : "hidden", userSelect: "none" }}
        />
      ))}
    </div>
  );
}
