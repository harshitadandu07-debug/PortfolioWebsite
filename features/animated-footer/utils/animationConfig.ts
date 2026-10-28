import { DOG_CANVAS, DOG_NOSE, GIRL_CANVAS, type DogFrame, type GirlFrame } from "./spriteManifest";

// Everything tunable about the delivery animation lives here: sprite sequences, timings and the two layouts.
// Coordinates are in "design pixels"; the scene is scaled to fit its container (see AnimatedFooter).

export const ASSET_BASE = "/animations/footer";
export const ACCENT = "#FB5233";
export const OWNER_EMAIL = "hdandu07@gmail.com";
export const DEFAULT_SUBJECT = "A little note for you";

// ---------------------------------------------------------------------------------------------------------
// Sprite sequences
// ---------------------------------------------------------------------------------------------------------
export type SpriteFrame = { src: string; ms: number };
export type SpriteSequence = { frames: SpriteFrame[]; loop: boolean };

const girl = (f: GirlFrame, ms: number): SpriteFrame => ({ src: `${ASSET_BASE}/character/${f}.png`, ms });
const dog = (f: DogFrame, ms: number): SpriteFrame => ({ src: `${ASSET_BASE}/dog/${f}.png`, ms });


export type GirlAnimation = "idle" | "handoff" | "pet" | "sleep";
export type DogAnimation = "idle" | "look" | "catch" | "run" | "stand";

/**
 * The girl. `idle` is her working loop, played from the typing frames with blinks at irregular intervals:
 * idle-3 is a quick blink; idle-5/6 are a slower, softer close; the rest are typing with tiny head movements.
 * Her frames are drawn one after the other; durations are what make it feel unhurried.
 */
export const GIRL_ANIMATIONS: Record<GirlAnimation, SpriteSequence> = {
  idle: {
    loop: true,
    frames: [
      ...[["idle-0", 260], ["idle-1", 190], ["idle-2", 200], ["idle-4", 230], ["idle-7", 200], ["idle-1", 190], ["idle-2", 210]].map(([f, ms]) => girl(f as GirlFrame, ms as number)),
      girl("idle-3", 120), // quick blink
      ...[["idle-2", 240], ["idle-0", 230], ["idle-4", 210], ["idle-7", 210], ["idle-1", 200], ["idle-2", 220], ["idle-0", 240], ["idle-4", 260], ["idle-1", 200], ["idle-2", 220]].map(([f, ms]) => girl(f as GirlFrame, ms as number)),
      girl("idle-5", 130), girl("idle-6", 190), girl("idle-5", 120), // slow, soft blink
      ...[["idle-0", 260], ["idle-4", 220], ["idle-1", 200], ["idle-2", 200], ["idle-7", 220], ["idle-4", 240], ["idle-1", 200], ["idle-2", 220], ["idle-0", 240], ["idle-4", 230], ["idle-7", 210], ["idle-1", 200], ["idle-2", 220]].map(([f, ms]) => girl(f as GirlFrame, ms as number)),
      girl("idle-3", 110), // another quick blink
      ...[["idle-0", 280], ["idle-1", 190], ["idle-2", 210]].map(([f, ms]) => girl(f as GirlFrame, ms as number)),
    ],
  },
  // The dog arrives with the letter, she reaches for it.
  handoff: { loop: false, frames: [girl("handoff-0", 520), girl("handoff-1", 640)] },
  // She pets the dog: the two petting frames alternate, slowly, like a stroking hand.
  pet: { loop: false, frames: [girl("pet-0", 380), girl("pet-1", 380), girl("pet-0", 360), girl("pet-1", 360), girl("pet-0", 340), girl("pet-1", 440)] },
  // The dog curled up asleep at her feet while she works (used when AFTER_DELIVERY is "sleep").
  sleep: { loop: false, frames: [girl("sleep", 1000)] },
};

/** The dog. All frames face right; the component mirrors them when the dog runs back. */
export const DOG_ANIMATIONS: Record<DogAnimation, SpriteSequence> = {
  // Waiting beside the postcard: looks at the visitor, now and then glances up and to the side.
  idle: { loop: true, frames: [dog("stand-front", 2200), dog("stand-look", 700), dog("stand-front", 1600), dog("stand-look", 500)] },
  look: { loop: false, frames: [dog("stand-look", 600)] }, // head raised, following the airplane
  catch: { loop: false, frames: [dog("stand-look", 600)] }, // mouth open at the catch
  run: { loop: true, frames: (["run-0", "run-1", "run-2", "run-3", "run-4"] as DogFrame[]).map((f) => dog(f, 70)) },
  stand: { loop: false, frames: [dog("stand-front", 1000)] },
};

/** Every image the scene uses, for preloading. */
export const ALL_SPRITE_SRCS: string[] = [
  ...new Set([...Object.values(GIRL_ANIMATIONS), ...Object.values(DOG_ANIMATIONS)].flatMap((s) => s.frames.map((f) => f.src))),
  `${ASSET_BASE}/postcard/envelope-front.png`,
];

/** Nose position of the dog frame that a sprite src points at (dog-canvas pixels). */
export function noseForSrc(src: string): readonly [number, number] {
  const name = src.split("/").pop()!.replace(".png", "") as DogFrame;
  return DOG_NOSE[name] ?? DOG_NOSE["stand-look"];
}

// ---------------------------------------------------------------------------------------------------------
// Timings (seconds unless noted)
// ---------------------------------------------------------------------------------------------------------
export const TIMING = {
  closeCard: 0.62, // form fades and the card slides into the envelope (CSS: .card[data-phase=closing])
  anticipate: 0.16, // the closed postcard takes a small breath before it folds
  squeeze: 0.38, // closed card squeezes into a letter
  foldToPlane: 0.6, // letter -> paper airplane
  flight: 1.7,
  crouchBefore: 0.5, // the dog crouches this long before the airplane arrives...
  jumpBefore: 0.3, // ...and leaves the ground this long before it does, so the catch is at the top of the jump
  catchMorph: 0.34, // airplane -> envelope in the dog's mouth
  catchHold: 0.4,
  runSpeed: 560, // design px per second (average; it accelerates and eases to a stop)
  gaitSpeed: 560, // the speed at which the run cycle plays at its natural pace; slower/faster steps follow the speed
  runBack: 1.3,
  confirmDelay: 0.4,
} as const;

/** How the story ends. "return": the dog trots back to its spot. "sleep": it curls up at her feet (its own frame). */
export const AFTER_DELIVERY: "return" | "sleep" = "sleep";

// ---------------------------------------------------------------------------------------------------------
// Layouts
// ---------------------------------------------------------------------------------------------------------

/**
 * Geometry of the postcard art in its own units (see animated-footer.module.css): the card's size and where the
 * closed postcard (the envelope plus the tab of the card that sticks out of it) sits. The airplane starts there.
 */
export const POSTCARD_GEOMETRY = {
  desktop: { base: 1536, height: 1234, paper: { left: 35, top: 562, width: 1469 } },
  mobile: { base: 760, height: 1080, paper: { left: 17, top: 474, width: 727 } },
} as const;

/** Where the dog's feet stand next to the girl in the hand-off frames, in girl-canvas pixels (measured from the sprites). */
export const DOG_AT_GIRL = { x: 66, feetY: 254 } as const;

export type SceneLayout = {
  name: "desktop" | "mobile";
  w: number;
  h: number;
  postcard: { x: number; y: number; w: number; h: number; unit: number };
  /** The closed postcard (envelope + tab), in design px: where the paper starts. */
  closed: { x: number; y: number; w: number; h: number };
  girl: { scale: number; left: number; top: number };
  dog: { scale: number; restX: number; feetY: number; stopX: number };
  /** Size of the airplane and of the envelope in the dog's mouth, in design px. */
  plane: { w: number; h: number };
  envelope: { w: number; h: number };
};

function build(name: SceneLayout["name"], w: number, h: number, pc: { x: number; y: number; w: number }, girlScale: number, girlLeft: number, bagBottom: number, dogRestX: number): SceneLayout {
  const geo = POSTCARD_GEOMETRY[name];
  const unit = pc.w / geo.base;
  const top = bagBottom - GIRL_CANVAS.anchor.y * girlScale;
  const dogScale = 0.36 * girlScale; // the dog in the hand-off frames is drawn at ~36% of the size of the dog sprite sheet
  return {
    name,
    w,
    h,
    postcard: { ...pc, h: geo.height * unit, unit },
    closed: { x: pc.x + geo.paper.left * unit, y: pc.y + geo.paper.top * unit, w: geo.paper.width * unit, h: (geo.height - geo.paper.top) * unit },
    girl: { scale: girlScale, left: girlLeft, top },
    dog: { scale: dogScale, restX: dogRestX, feetY: top + DOG_AT_GIRL.feetY * girlScale, stopX: girlLeft + DOG_AT_GIRL.x * girlScale },
    plane: { w: 118 * girlScale, h: 70 * girlScale },
    envelope: { w: 44 * girlScale, h: 29 * girlScale },
  };
}

export const LAYOUTS: Record<SceneLayout["name"], SceneLayout> = {
  // Dog on the left, the postcard in the centre, the girl on the right. The dog runs across in front of the postcard.
  desktop: build("desktop", 1400, 640, { x: 380, y: 28, w: 640 }, 1.3, 1008, 600, 190),
  // Stacked: postcard on top, the dog (left) and the girl (right) share the area below it.
  mobile: build("mobile", 420, 860, { x: 10, y: 0, w: 400 }, 1.0, 112, 832, 58),
};

export const MOBILE_BREAKPOINT = 980; // container width in px below which the stacked layout is used

/** Dog sprite size in design px for a layout. */
export function dogSize(layout: SceneLayout) {
  return { w: DOG_CANVAS.w * layout.dog.scale, h: DOG_CANVAS.h * layout.dog.scale };
}
