"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import styles from "../styles/classes";
import { paperClip } from "../utils/paperShapes";
import Envelope from "./Envelope";

export type PaperMotion = {
  /** Centre of the paper, in design px. */
  cx: MotionValue<number>;
  cy: MotionValue<number>;
  w: MotionValue<number>;
  h: MotionValue<number>;
  rotate: MotionValue<number>;
  /** 0 = closed postcard, 1 = airplane, 2 = envelope. */
  morph: MotionValue<number>;
  /** 1 faces right, -1 faces left. */
  flip: MotionValue<number>;
};

/**
 * The one piece of paper that carries the message. It starts as the closed postcard (cream card + green envelope),
 * folds into a paper airplane, and becomes the small envelope in the dog's mouth: a single element that keeps
 * the postcard's colours and texture all the way through.
 */
export default function PaperAirplane({ paper }: { paper: PaperMotion }) {
  const x = useTransform([paper.cx, paper.w], ([cx, w]: number[]) => cx - w / 2);
  const y = useTransform([paper.cy, paper.h], ([cy, h]: number[]) => cy - h / 2);
  const clipPath = useTransform(paper.morph, paperClip);
  const envelopeOpacity = useTransform(paper.morph, [1.2, 1.9], [0, 1]);
  return (
    <motion.div className={styles.paperShadow} style={{ x, y, width: paper.w, height: paper.h, scaleX: paper.flip, rotate: paper.rotate }}>
      <motion.div className={styles.paper} style={{ clipPath }}>
        <motion.div style={{ position: "absolute", inset: 0, opacity: envelopeOpacity }}>
          <Envelope opacity={1} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
