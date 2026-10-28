"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useDeliverySequence } from "../hooks/useDeliverySequence";
import "../styles/animated-footer.css";
import styles from "../styles/classes";
import { ALL_SPRITE_SRCS, LAYOUTS, MOBILE_BREAKPOINT } from "../utils/animationConfig";
import { mockSubmitMessage, type SubmitMessage } from "../utils/mockSubmit";
import { DOG_CANVAS } from "../utils/spriteManifest";
import DogCharacter from "./DogCharacter";
import PaperAirplane from "./PaperAirplane";
import PortfolioCharacter from "./PortfolioCharacter";
import PostcardForm from "./PostcardForm";

export type AnimatedFooterProps = {
  /**
   * Called when a visitor sends the postcard. Resolve when the message has been accepted, reject if it failed.
   * Defaults to a mock that sends nothing, so the animation can be built and tested without an email service.
   */
  submitMessage?: SubmitMessage;
  className?: string;
  /** "light" puts the confirmation text in white, for use on a dark or blue background. */
  tone?: "dark" | "light";
  /** Scale the scene down so it is never taller than this many px (e.g. to fit a short screen). */
  maxHeight?: number;
  /** Reports the scene's rendered height in px, so a host can size the space around it. */
  onHeightChange?: (height: number) => void;
};

const STATUS: Partial<Record<string, string>> = {
  SUBMITTING: "Sending your message…",
  DELIVERY_COMPLETE: "Message delivered! Thanks for reaching out. I’ll get back to you soon!",
};

/**
 * A little story in place of a contact form: write on the postcard, press Send, and a puppy carries the message
 * to me on my beanbag. The whole scene is drawn in a fixed design space and scaled to fit its container.
 */
export default function AnimatedFooter({ submitMessage = mockSubmitMessage, className, tone = "dark", maxHeight, onHeightChange }: AnimatedFooterProps) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Every frame is decoded before the scene appears, so no animation ever waits on the network.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ALL_SPRITE_SRCS.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = img.onerror = () => resolve();
            img.src = src;
          }),
      ),
    ).then(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const layout = width > 0 && width < MOBILE_BREAKPOINT ? LAYOUTS.mobile : LAYOUTS.desktop;
  const fit = Math.min(width / layout.w, maxHeight ? maxHeight / layout.h : Infinity, layout.name === "mobile" ? 1.3 : 1);
  const k = width > 0 ? fit : 1;
  const seq = useDeliverySequence({ layout, submit: submitMessage, reducedMotion: reduced });
  const { postcard: pc, girl, dog } = layout;
  const dogTop = dog.feetY - DOG_CANVAS.baseline * dog.scale;
  const ready = loaded && width > 0;
  const sceneHeight = layout.h * k;
  useEffect(() => {
    if (ready) onHeightChange?.(sceneHeight);
  }, [ready, sceneHeight, onHeightChange]);

  return (
    <section className={`${styles.root} ${className ?? ""}`} aria-label="Contact" data-tone={tone}>
      <div ref={box} className={styles.sceneBox} style={{ height: ready ? sceneHeight : 0, maxWidth: layout.w, opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <div className={styles.stage} style={{ width: layout.w, height: layout.h, transform: `scale(${k})`, left: Math.max(0, (width - layout.w * k) / 2) }}>
          <div className={styles.abs} style={{ left: pc.x, top: pc.y, width: pc.w, zIndex: 3 }}>
            <PostcardForm
              key={seq.formKey}
              phase={seq.postcard}
              compact={layout.name === "mobile"}
              busy={seq.busy}
              busyLabel={seq.phase === "RESETTING" ? "Send" : "Sending…"}
              externalError={seq.error}
              onSubmit={seq.send}
              onFirstInput={seq.noteTyping}
            />
          </div>

          {seq.confirmation && (
            <motion.div
              className={styles.confirm}
              style={{ left: pc.x, top: pc.y, width: pc.w, height: pc.h, zIndex: 3, padding: layout.name === "mobile" ? "0 22px" : "0 48px", alignItems: "center", textAlign: "center" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <h2 className={styles.confirmTitle}>Message delivered! 🐾</h2>
              <p className={styles.confirmText}>Thanks for reaching out. I’ll get back to you soon!</p>
              <button type="button" className={styles.again} onClick={seq.reset}>
                Write another message
              </button>
            </motion.div>
          )}

          <div className={`${styles.abs} ${styles.noPointer}`} style={{ left: girl.left, top: girl.top, zIndex: 1 }}>
            <PortfolioCharacter animation={seq.girlAnim} scale={girl.scale} onComplete={seq.onGirlComplete} />
          </div>

          {seq.dog.mode !== "hidden" && (
            <motion.div
              className={`${styles.abs} ${styles.noPointer}`}
              style={{
                left: -DOG_CANVAS.centerX * dog.scale,
                top: dogTop,
                x: seq.dogX,
                y: seq.dogY,
                scaleY: seq.dogSquash,
                rotate: seq.dogLean,
                opacity: seq.dogOpacity,
                transformOrigin: `${DOG_CANVAS.centerX * dog.scale}px ${(DOG_CANVAS.baseline / DOG_CANVAS.h) * 100}%`,
                zIndex: 4,
              }}
            >
              <DogCharacter animation={seq.dog.mode} scale={dog.scale} flipped={seq.dog.flipped} durationScale={seq.gait} onFrame={seq.onDogFrame} />
            </motion.div>
          )}

          {seq.paperVisible && (
            <div className={styles.noPointer} style={{ position: "absolute", inset: 0, zIndex: 5 }}>
              <PaperAirplane paper={seq.paper} />
            </div>
          )}
        </div>
      </div>
      <p className={styles.srOnly} role="status" aria-live="polite">
        {STATUS[seq.phase] ?? ""}
      </p>
    </section>
  );
}
