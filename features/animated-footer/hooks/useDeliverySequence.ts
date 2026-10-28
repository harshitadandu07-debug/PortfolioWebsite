"use client";

import { animate, useAnimationFrame, useMotionValue, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PostcardPhase } from "../components/PostcardForm";
import { AFTER_DELIVERY, TIMING, noseForSrc, type DogAnimation, type GirlAnimation, type SceneLayout, type SpriteFrame } from "../utils/animationConfig";
import type { MessagePayload, SubmitMessage } from "../utils/mockSubmit";
import { DOG_CANVAS, DOG_NOSE } from "../utils/spriteManifest";

/** The explicit states of the experience. Exactly one is active at a time. */
export type Phase =
  | "IDLE"
  | "COMPOSING"
  | "SUBMITTING"
  | "POSTCARD_FOLDING"
  | "AIRPLANE_FLYING"
  | "DOG_CATCHING"
  | "DOG_RUNNING"
  | "CHARACTER_NOTICING"
  | "LETTER_HANDOFF"
  | "PETTING"
  | "DELIVERY_COMPLETE"
  | "RESETTING";

type DogState = { mode: DogAnimation | "hidden"; flipped: boolean };
export type PaperMotion = {
  cx: MotionValue<number>;
  cy: MotionValue<number>;
  w: MotionValue<number>;
  h: MotionValue<number>;
  rotate: MotionValue<number>;
  morph: MotionValue<number>;
  /** 1 faces right, -1 faces left (the airplane is drawn pointing right). */
  flip: MotionValue<number>;
};

type Options = { layout: SceneLayout; submit: SubmitMessage; reducedMotion: boolean };

const CANCELLED = Symbol("cancelled");
const EASE_IN_OUT = [0.6, 0, 0.35, 1] as const;
const EASE_OUT = [0.2, 0.7, 0.25, 1] as const;
const EASE_IN = [0.55, 0, 0.8, 0.4] as const;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Runs the whole delivery as one coordinated timeline. A single async function walks the states in order; the
 * dog, the girl, the postcard and the paper are all driven from it, so nothing is timed separately. Starting a
 * new run (or unmounting) cancels the current one.
 */
export function useDeliverySequence({ layout, submit, reducedMotion }: Options) {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [girlAnim, setGirlAnim] = useState<GirlAnimation>("idle");
  const [dog, setDog] = useState<DogState>({ mode: "idle", flipped: false });
  const [postcard, setPostcard] = useState<PostcardPhase>("open");
  const [paperVisible, setPaperVisible] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  // Continuous values that drive the scene (design px unless noted).
  const dogX = useMotionValue(layout.dog.restX);
  const dogHop = useMotionValue(0); // jump offset; negative is up
  const dogY = useMotionValue(0); // hop + the little bob of the run
  const dogSquash = useMotionValue(1); // vertical squash and stretch, from the feet
  const dogLean = useMotionValue(0); // degrees, leaning into the run
  const dogOpacity = useMotionValue(1);
  const gait = useMotionValue(1); // multiplies run-frame durations: bigger = slower steps
  const paper: PaperMotion = {
    cx: useMotionValue(0),
    cy: useMotionValue(0),
    w: useMotionValue(0),
    h: useMotionValue(0),
    rotate: useMotionValue(0),
    morph: useMotionValue(0),
    flip: useMotionValue(1),
  };

  const layoutRef = useRef(layout);
  const runId = useRef(0); // bumped to cancel the run in progress
  const running = useRef(false);
  const girlDone = useRef<(() => void) | null>(null);
  const carrying = useRef(false);
  const heading = useRef(1); // which way the dog is running: 1 right, -1 left
  const asleep = useRef(false); // the dog is curled up at her feet (AFTER_DELIVERY "sleep")
  const nose = useRef<readonly [number, number]>(DOG_NOSE["stand-look"]);
  const dogMove = useRef<{ stop: () => void } | null>(null); // the dog's current run, so a new message can cancel it
  const moveDog = useCallback(
    (to: number, options: { duration: number; ease: readonly [number, number, number, number] }) => {
      dogMove.current?.stop();
      const controls = animate(dogX, to, { duration: options.duration, ease: [...options.ease] });
      dogMove.current = controls;
      return controls;
    },
    [dogX],
  );
  useEffect(() => {
    layoutRef.current = layout;
    if (!running.current) dogX.set(layout.dog.restX); // not mid-delivery: keep the dog at its post
  }, [layout, dogX]);
  useEffect(
    () => () => {
      runId.current += 1; // leaving the page cancels any delivery in progress
    },
    [],
  );

  const wait = useCallback(
    (seconds: number, id: number) =>
      new Promise<void>((resolve, reject) => {
        window.setTimeout(() => (runId.current === id ? resolve() : reject(CANCELLED)), seconds * 1000);
      }),
    [],
  );
  const alive = (id: number) => {
    if (runId.current !== id) throw CANCELLED;
  };

  // Resolves when the girl's current (non-looping) sequence has played to its end.
  const playGirl = (anim: GirlAnimation) =>
    new Promise<void>((resolve) => {
      girlDone.current = resolve;
      setGirlAnim(anim);
    });
  const onGirlComplete = useCallback(() => {
    const done = girlDone.current;
    girlDone.current = null;
    done?.();
  }, []);
  const onDogFrame = useCallback((_i: number, frame: SpriteFrame) => {
    nose.current = noseForSrc(frame.src);
  }, []);

  // Where the dog's mouth is, in design px, for a dog standing at `x` in a pose whose nose is `n`.
  // The mouth opening sits about 22px behind and 30px below the nose in sprite pixels (measured on every frame).
  const mouth = (x: number, n: readonly [number, number], y = 0) => {
    const L = layoutRef.current;
    const s = L.dog.scale;
    return { x: x + (n[0] - 22 - DOG_CANVAS.centerX) * s, y: L.dog.feetY - DOG_CANVAS.baseline * s + (n[1] + 30) * s + y };
  };
  // The envelope is held in the mouth: its right-hand end is between the jaws.
  const held = (m: { x: number; y: number }) => {
    const L = layoutRef.current;
    return { x: m.x - L.envelope.w * 0.3, y: m.y - L.envelope.h * 0.12 };
  };

  // Every frame: the run's stride follows the dog's real speed (so feet never skate), it bobs and leans into
  // the run, and a carried envelope stays in its mouth.
  useAnimationFrame(() => {
    const L = layoutRef.current;
    const v = Math.abs(dogX.getVelocity());
    const moving = clamp(v / 160, 0, 1);
    gait.set(clamp(TIMING.gaitSpeed / Math.max(v, 70), 0.7, 3.2));
    dogLean.set(heading.current * clamp(v / 800, 0, 1) * 2.4);
    const bob = -Math.abs(Math.sin((dogX.get() * Math.PI) / (95 * L.dog.scale * 2))) * 4 * L.dog.scale * moving;
    dogY.set(dogHop.get() + bob);
    if (carrying.current) {
      const p = held(mouth(dogX.get(), nose.current, dogY.get()));
      paper.cx.set(p.x);
      paper.cy.set(p.y);
    }
  });

  const send = useCallback(
    async (payload: MessagePayload) => {
      const id = ++runId.current;
      running.current = true;
      const L = layoutRef.current;
      dogMove.current?.stop(); // a dog still trotting home from the last message stops where it is...
      dogX.set(L.dog.restX); // ...and is at its post for this one
      dogOpacity.set(1);
      dogHop.set(0);
      dogSquash.set(1);
      heading.current = 1;
      setDog({ mode: "idle", flipped: false });
      try {
        setError(null);
        setPhase("SUBMITTING");
        try {
          await submit(payload);
        } catch {
          alive(id);
          setError("Couldn’t send that. Please try again.");
          setPhase("COMPOSING");
          running.current = false;
          return;
        }
        alive(id);

        if (reducedMotion) {
          setPostcard("hidden");
          setConfirmation(true);
          setPhase("DELIVERY_COMPLETE");
          return;
        }

        // 1. The postcard closes: the form fades and the card slides into its envelope.
        setPhase("POSTCARD_FOLDING");
        setPostcard("closing");
        await wait(TIMING.closeCard, id);
        paper.cx.set(L.closed.x + L.closed.w / 2);
        paper.cy.set(L.closed.y + L.closed.h / 2);
        paper.w.set(L.closed.w);
        paper.h.set(L.closed.h);
        paper.rotate.set(0);
        paper.morph.set(0);
        paper.flip.set(1);
        setPaperVisible(true); // the paper takes over exactly where the closed postcard was
        setPostcard("hidden");
        await wait(0.04, id);

        // ...takes a small breath, as if gathering itself...
        const cy0 = paper.cy.get();
        await Promise.all([
          animate(paper.w, L.closed.w * 1.035, { duration: TIMING.anticipate, ease: EASE_OUT }),
          animate(paper.h, L.closed.h * 1.035, { duration: TIMING.anticipate, ease: EASE_OUT }),
          animate(paper.cy, cy0 - 7, { duration: TIMING.anticipate, ease: EASE_OUT }),
        ]);
        alive(id);
        // ...squeezes into a letter...
        await Promise.all([
          animate(paper.w, L.closed.w * 0.56, { duration: TIMING.squeeze, ease: EASE_IN_OUT }),
          animate(paper.h, L.closed.h * 0.5, { duration: TIMING.squeeze, ease: EASE_IN_OUT }),
          animate(paper.cy, cy0 - 14, { duration: TIMING.squeeze, ease: EASE_IN_OUT }),
        ]);
        alive(id);

        // ...and folds into a paper airplane that turns toward the dog and lifts off.
        const hopH = 30 * L.dog.scale * 1.6; // how high the dog jumps for the catch
        const target = mouth(L.dog.restX, DOG_NOSE["stand-look"], -hopH); // where the mouth is at the top of the jump
        const start = { x: paper.cx.get(), y: paper.cy.get() - 30 * L.girl.scale };
        const flip = target.x < start.x ? -1 : 1; // the airplane is drawn pointing right: mirror it to fly left
        const ctrl = { x: start.x + (target.x - start.x) * 0.5, y: Math.min(start.y, target.y) - 70 * L.girl.scale };
        const angleAt = (t: number) => {
          const dx = flip * (2 * (1 - t) * (ctrl.x - start.x) + 2 * t * (target.x - ctrl.x));
          const dy = 2 * (1 - t) * (ctrl.y - start.y) + 2 * t * (target.y - ctrl.y);
          return (Math.atan2(dy, dx) * 180) / Math.PI; // measured in the mirrored space, where the airplane points right
        };
        paper.flip.set(flip);
        setDog({ mode: "look", flipped: false }); // the dog lifts its head to follow it
        await Promise.all([
          animate(paper.w, L.plane.w, { duration: TIMING.foldToPlane, ease: EASE_IN_OUT }),
          animate(paper.h, L.plane.h, { duration: TIMING.foldToPlane, ease: EASE_IN_OUT }),
          animate(paper.morph, 1, { duration: TIMING.foldToPlane, ease: EASE_IN_OUT }),
          animate(paper.cy, start.y, { duration: TIMING.foldToPlane, ease: EASE_OUT }),
          animate(paper.rotate, angleAt(0), { type: "spring", stiffness: 120, damping: 11, mass: 0.8 }), // settles with a little overshoot
        ]);
        alive(id);

        // 2. The airplane glides a long arc to the dog, wobbling gently. Meanwhile the dog gets ready: it crouches,
        //    then jumps, so that the catch happens at the top of the jump.
        setPhase("AIRPLANE_FLYING");
        const dogPrep = (async () => {
          await wait(TIMING.flight - TIMING.crouchBefore, id);
          await animate(dogSquash, 0.9, { duration: TIMING.crouchBefore - TIMING.jumpBefore, ease: EASE_OUT });
          await Promise.all([
            animate(dogHop, -hopH, { duration: TIMING.jumpBefore, ease: [0.15, 0.7, 0.35, 1] }),
            animate(dogSquash, [0.9, 1.07, 1.03], { duration: TIMING.jumpBefore, ease: "easeOut" }),
          ]);
        })();
        await animate(0, 1, {
          duration: TIMING.flight,
          ease: [0.42, 0.02, 0.22, 1], // a gentle start, a long glide, a soft arrival
          onUpdate: (t) => {
            const fade = 1 - t; // wobble dies away as it settles toward the dog
            paper.cx.set((1 - t) ** 2 * start.x + 2 * (1 - t) * t * ctrl.x + t ** 2 * target.x);
            paper.cy.set((1 - t) ** 2 * start.y + 2 * (1 - t) * t * ctrl.y + t ** 2 * target.y + Math.sin(t * Math.PI * 2 * 2.4) * 4 * fade);
            paper.rotate.set(angleAt(t) + Math.sin(t * Math.PI * 2 * 1.6) * 6 * fade);
          },
        });
        alive(id);
        await dogPrep.catch((e) => {
          if (e !== CANCELLED) throw e;
        });
        alive(id);

        // 3. The dog catches it at the top of its jump: the airplane becomes an envelope in its mouth, and the dog lands.
        setPhase("DOG_CATCHING");
        setDog({ mode: "catch", flipped: false });
        nose.current = DOG_NOSE["stand-look"];
        carrying.current = true; // from here the envelope follows the dog's mouth, frame by frame
        paper.flip.set(1);
        await Promise.all([
          animate(paper.morph, 2, { duration: TIMING.catchMorph, ease: EASE_IN_OUT }),
          animate(paper.w, L.envelope.w, { duration: TIMING.catchMorph, ease: EASE_IN_OUT }),
          animate(paper.h, L.envelope.h, { duration: TIMING.catchMorph, ease: EASE_IN_OUT }),
          animate(paper.rotate, -4, { duration: TIMING.catchMorph, ease: EASE_IN_OUT }),
          animate(dogHop, 0, { duration: 0.34, ease: EASE_IN }),
          animate(dogSquash, [1.03, 0.93, 1], { duration: 0.4, ease: "easeOut", times: [0, 0.55, 1] }), // lands softly
        ]);
        alive(id);
        await wait(TIMING.catchHold, id);

        // 4. The dog runs across to the girl, in front of the postcard: it speeds up, then eases to a stop.
        setPhase("DOG_RUNNING");
        heading.current = 1;
        setDog({ mode: "run", flipped: false });
        const distance = L.dog.stopX - dogX.get();
        const runTime = clamp((distance / TIMING.runSpeed) * 1.22, 0.9, 2.6);
        await moveDog(L.dog.stopX, { duration: runTime, ease: [0.5, 0, 0.18, 1] });
        alive(id);
        setPhase("CHARACTER_NOTICING");
        setDog({ mode: "stand", flipped: false }); // plants its feet: no sliding to a stop
        await Promise.all([animate(dogLean, 0, { duration: 0.2 }), wait(0.26, id)]);

        // 5. Hand-off: the sprite sheet's own frames show the dog, the envelope and the girl together. The standing
        //    dog dissolves into them, so there is no pop and never two envelopes.
        setPhase("LETTER_HANDOFF");
        carrying.current = false;
        setPaperVisible(false);
        const handoff = playGirl("handoff");
        await animate(dogOpacity, 0, { duration: 0.16 });
        setDog({ mode: "hidden", flipped: false });
        dogOpacity.set(1);
        await handoff;
        alive(id);

        // 6. She pets the dog.
        setPhase("PETTING");
        await playGirl("pet");
        alive(id);

        // 7. Delivered.
        setPhase("DELIVERY_COMPLETE");
        if (AFTER_DELIVERY === "sleep") {
          asleep.current = true;
          setGirlAnim("sleep"); // the dog curls up at her feet while she goes back to work
          await wait(TIMING.confirmDelay, id);
          setConfirmation(true);
        } else {
          dogOpacity.set(0);
          setDog({ mode: "stand", flipped: false }); // the dog steps back from her side...
          setGirlAnim("idle"); // ...and she goes back to typing
          await animate(dogOpacity, 1, { duration: 0.16 });
          await wait(TIMING.confirmDelay, id);
          setConfirmation(true);
          heading.current = -1;
          setDog({ mode: "run", flipped: true });
          await moveDog(L.dog.restX, { duration: TIMING.runBack, ease: [0.5, 0, 0.2, 1] });
          alive(id);
          setDog({ mode: "stand", flipped: false });
          await Promise.all([animate(dogLean, 0, { duration: 0.2 }), wait(0.22, id)]);
          heading.current = 1;
          setDog({ mode: "idle", flipped: false });
        }
        running.current = false;
      } catch (e) {
        if (e !== CANCELLED) throw e;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- motion values are stable; the rest is read through refs
    [submit, reducedMotion, wait],
  );

  const reset = useCallback(async () => {
    const id = ++runId.current;
    running.current = true;
    carrying.current = false;
    girlDone.current = null;
    dogMove.current?.stop();
    setPhase("RESETTING");
    setConfirmation(false);
    setPaperVisible(false);
    setError(null);
    setFormKey((k) => k + 1);
    setPostcard("opening");
    setGirlAnim("idle");
    const L = layoutRef.current;
    try {
      const wasAsleep = asleep.current;
      asleep.current = false;
      if (wasAsleep) {
        // The dog wakes up and gets to its feet beside her...
        dogX.set(L.dog.stopX);
        dogOpacity.set(0);
        setDog({ mode: "stand", flipped: false });
        await animate(dogOpacity, 1, { duration: 0.16 });
      } else {
        dogX.set(L.dog.restX);
        setDog({ mode: "idle", flipped: false });
      }
      // ...while the postcard is already back and ready to use: the form never waits for the dog.
      await wait(0.5, id);
      setPostcard("open");
      setPhase("IDLE");
      if (wasAsleep) {
        await wait(0.3, id);
        heading.current = -1;
        setDog({ mode: "run", flipped: true });
        await moveDog(L.dog.restX, { duration: TIMING.runBack, ease: [0.5, 0, 0.2, 1] });
        alive(id);
        setDog({ mode: "stand", flipped: false });
        await Promise.all([animate(dogLean, 0, { duration: 0.2 }), wait(0.22, id)]);
        heading.current = 1;
        setDog({ mode: "idle", flipped: false });
      }
      running.current = false;
    } catch (e) {
      if (e !== CANCELLED) throw e;
    }
  }, [dogX, dogOpacity, dogLean, wait, moveDog]);

  const noteTyping = useCallback(() => setPhase((p) => (p === "IDLE" ? "COMPOSING" : p)), []);

  return {
    phase,
    busy: phase !== "IDLE" && phase !== "COMPOSING",
    girlAnim,
    dog,
    postcard,
    paperVisible,
    confirmation,
    error,
    formKey,
    dogX,
    dogY,
    dogSquash,
    dogLean,
    dogOpacity,
    gait,
    paper,
    send,
    reset,
    noteTyping,
    onGirlComplete,
    onDogFrame,
  };
}
