"use client";

import { GIRL_ANIMATIONS, type GirlAnimation } from "../utils/animationConfig";
import { GIRL_CANVAS } from "../utils/spriteManifest";
import SpriteAnimator from "./SpriteAnimator";

type Props = {
  animation: GirlAnimation;
  /** Design px per sprite pixel. */
  scale: number;
  onComplete?: () => void;
};

/** The animated girl on her beanbag. Every frame is aligned on the beanbag corner, so swapping frames never shifts her. */
export default function PortfolioCharacter({ animation, scale, onComplete }: Props) {
  return (
    <SpriteAnimator
      sequence={GIRL_ANIMATIONS[animation]}
      animationKey={animation}
      width={GIRL_CANVAS.w * scale}
      height={GIRL_CANVAS.h * scale}
      onComplete={onComplete}
    />
  );
}
