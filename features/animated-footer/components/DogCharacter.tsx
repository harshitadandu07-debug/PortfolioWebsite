"use client";

import type { MotionValue } from "motion/react";
import { DOG_ANIMATIONS, type DogAnimation, type SpriteFrame } from "../utils/animationConfig";
import { DOG_CANVAS } from "../utils/spriteManifest";
import SpriteAnimator from "./SpriteAnimator";

type Props = {
  animation: DogAnimation;
  /** Design px per sprite pixel. */
  scale: number;
  /** Mirror the dog so it faces left (the sprites all face right). */
  flipped?: boolean;
  /** Stride speed. Pass a motion value to tie the steps to the dog's real speed. */
  durationScale?: number | MotionValue<number>;
  onFrame?: (index: number, frame: SpriteFrame) => void;
  onComplete?: () => void;
};

/** The puppy. Frames are normalized, so the element's centre-x is the dog's body centre and its bottom edge is the ground. */
export default function DogCharacter({ animation, scale, flipped = false, durationScale, onFrame, onComplete }: Props) {
  return (
    <SpriteAnimator
      sequence={DOG_ANIMATIONS[animation]}
      animationKey={animation}
      width={DOG_CANVAS.w * scale}
      height={DOG_CANVAS.h * scale}
      durationScale={durationScale}
      onFrame={onFrame}
      onComplete={onComplete}
      style={{ transform: flipped ? "scaleX(-1)" : undefined, transformOrigin: `${DOG_CANVAS.centerX * scale}px 50%` }}
    />
  );
}
