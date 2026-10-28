"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, type MotionValue } from "motion/react";

// Hands from the Figma "GrabToggle" animation. Coordinates are in the original 759x368 toggle frame;
// the stage is scaled down to the real track. Times are seconds from the click.
//  - OFF -> ON: the right hand comes in from the right and drags the circle to the right.
//  - ON -> OFF: the left hand reaches across from the "Before" side, pinches the blue circle with its
//    body behind it, and pulls the circle back left (a hand on the right would only push it).
const DIR = "/images/case-studies/doodlelearning/toggle";
export const STAGE = { w: 759, h: 368 };

type Piece = { src: string; x: number; y: number; w: number; h: number; inset: string; flip?: boolean };
const HAND_INSET = "-0.44% 0 -0.87% -0.3%";
const THUMB_INSET = "-7.75% -4.49% -10.85% -4.49%";
const PIECES = {
  rightHand: { src: `${DIR}/right-hand.svg`, x: 768.631, y: 73.203, w: 641.488, h: 221.536, inset: HAND_INSET },
  rightThumb: { src: `${DIR}/right-thumb.svg`, x: 875.555, y: 73.202, w: 257.317, h: 124.253, inset: THUMB_INSET },
  // The Figma export draws the left hand with the same artwork as the right one (the flip was lost), so it is
  // mirrored here: fingers and thumb point right, sleeve on the left. Frames are the right-hand frames mirrored.
  leftHand: { src: `${DIR}/right-hand.svg`, x: 0, y: 73.203, w: 641.488, h: 221.536, inset: HAND_INSET, flip: true },
  leftThumb: { src: `${DIR}/right-thumb.svg`, x: 277.26, y: 73.202, w: 257.317, h: 124.253, inset: THUMB_INSET, flip: true },
} satisfies Record<string, Piece>;

const SLIDE_EASE = [0.67, 0, 0.767, 1] as const;
const THUMB_EASE = [0.67, 0, 0.77, 1] as const;
const LEAVE_EASE = [0.5, 0, 1, 1] as const;

// Right hand (turning on): x offsets from the Figma timeline.
const RIGHT_FAR = 13.485; // outside the track, right
const RIGHT_GRAB = -620.298; // thumb pinching the circle at its OFF position
const ON = { duration: 0.8466, arrive: 0.415 }; // comes in, then drags the circle out

// Left hand (turning off), the mirror image of the right hand's grip: the thumb tip sits 222.5 inside the
// circle's trailing edge (right edge), so with the circle at its ON position the grab x is `drag - 421.9`.
// The pull moves exactly `drag`, ending where the right hand started its grip. Offsets are in stage units.
const LEFT_OUTSIDE = -646.5; // palm and sleeve fully outside the track, on the left
const LEFT_GRIP_OFFSET = -421.9;
const OFF = { arrive: 0.455, pinch: 0.044, pull: 0.482, leave: 0.25 }; // reach across, grab, pull in lockstep, let go and leave

// Seconds from the click until the toggle circle starts sliding (the hand has pinched it).
export const GRAB_DELAY = { on: 0.398, off: 0.499 };

function PieceView({ piece, x, opacity }: { piece: Piece; x: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.div className="absolute" style={{ left: piece.x, top: piece.y, width: piece.w, height: piece.h, x, opacity }}>
      <div className="absolute" style={{ inset: piece.inset, transform: piece.flip ? "scaleX(-1)" : undefined }}>
        <Image src={piece.src} alt="" fill unoptimized className="max-w-none" />
      </div>
    </motion.div>
  );
}

export function useToggleHands() {
  const rightHand = useMotionValue(RIGHT_FAR);
  const rightThumb = useMotionValue(RIGHT_FAR);
  const leftHand = useMotionValue(LEFT_OUTSIDE);
  const leftThumb = useMotionValue(LEFT_OUTSIDE);
  // A hand is only shown while it moves, so the resting toggle stays a plain switch.
  const rightShown = useMotionValue(0);
  const leftShown = useMotionValue(0);

  // `drag` is how far the circle travels, in stage units; the left hand's grab and pull distance follow it.
  const play = (toOn: boolean, drag: number) => {
    if (toOn) {
      rightShown.set(1);
      const times = [0, ON.arrive / ON.duration, 1];
      const done = () => rightShown.set(0);
      animate(rightHand, [0, RIGHT_GRAB, RIGHT_FAR], { duration: ON.duration, times, ease: ["linear", SLIDE_EASE], onComplete: done });
      animate(rightThumb, [0, RIGHT_GRAB, RIGHT_FAR], { duration: ON.duration, times, ease: ["linear", THUMB_EASE] });
    } else {
      leftShown.set(1);
      const grab = drag + LEFT_GRIP_OFFSET;
      const pulled = grab - drag;
      const t1 = OFF.arrive;
      const t2 = t1 + OFF.pinch;
      const t3 = t2 + OFF.pull;
      const total = t3 + OFF.leave;
      const times = [0, t1, t2, t3, total].map((t) => t / total);
      const keyframes = [LEFT_OUTSIDE, grab, grab, pulled, LEFT_OUTSIDE];
      const done = () => leftShown.set(0);
      animate(leftHand, keyframes, { duration: total, times, ease: ["linear", "linear", SLIDE_EASE, LEAVE_EASE], onComplete: done });
      animate(leftThumb, keyframes, { duration: total, times, ease: ["linear", "linear", THUMB_EASE, LEAVE_EASE] });
    }
  };

  // Figma layer order: palms sit behind the toggle circle, thumbs in front of it.
  const back = (
    <>
      <PieceView piece={PIECES.rightHand} x={rightHand} opacity={rightShown} />
      <PieceView piece={PIECES.leftHand} x={leftHand} opacity={leftShown} />
    </>
  );
  const front = (
    <>
      <PieceView piece={PIECES.rightThumb} x={rightThumb} opacity={rightShown} />
      <PieceView piece={PIECES.leftThumb} x={leftThumb} opacity={leftShown} />
    </>
  );
  return { back, front, play };
}

// Clips the scaled 759x368 stage to the toggle track, like the Figma frame does.
export function HandsStage({ track, children }: { track: { w: number; h: number; radius: string }; children: React.ReactNode }) {
  const scale = track.w / STAGE.w;
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: track.radius }} aria-hidden>
      <span
        className="absolute left-0"
        style={{ top: (track.h - STAGE.h * scale) / 2, width: STAGE.w, height: STAGE.h, transform: `scale(${scale})`, transformOrigin: "0 0" }}
      >
        {children}
      </span>
    </span>
  );
}
