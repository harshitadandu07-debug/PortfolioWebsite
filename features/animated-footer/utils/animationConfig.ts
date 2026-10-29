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


export type GirlAnimation = "idle" | "settle" | "take" | "receive" | "pet" | "coffee" | "resume";
export type DogAnimation = "idle" | "look" | "crouch" | "jump" | "catch" | "run" | "stand" | "sit" | "paw" | "lie" | "sleep" | "wake";

const seq = (loop: boolean, frames: [GirlFrame, number][]): SpriteSequence => ({ loop, frames: frames.map(([f, ms]) => girl(f, ms)) });

/**
 * The girl. She works on her laptop (`idle`), then sets it aside when the dog arrives (`settle`), holds out a hand
 * (`take`), takes the letter from the dog's mouth, opens it and reads it (`receive`), pets the dog (`pet`), and finally sips a coffee
 * (`coffee`). `resume` is the way back to typing. Her frames are drawn one after the other; durations set the pace.
 */
export const GIRL_ANIMATIONS: Record<GirlAnimation, SpriteSequence> = {
  idle: seq(true, [
    ["idle-0", 280], ["idle-1", 210], ["idle-2", 230], ["idle-3", 260], ["idle-2", 200], ["idle-1", 220],
    ["idle-0", 300], ["idle-2", 210], ["idle-3", 240], ["idle-1", 210], ["idle-0", 260], ["idle-2", 230],
    ["idle-3", 420], ["idle-2", 220], ["idle-1", 200], ["idle-0", 240],
  ]),
  // The laptop is lifted, moved to her side, and her hands come to rest.
  settle: seq(false, [["idle-3", 200], ["lift-0", 240], ["lift-1", 300], ["aside-0", 300], ["aside-1", 360]]),
  // She looks down, reaches out to the dog's mouth and takes the letter; the last frame has the envelope in her hand.
  take: seq(false, [["rest", 320], ["reach", 760], ["stow", 620]]),
  // The letter is in her hands: she opens the envelope, takes the letter out and reads it.
  receive: seq(false, [
    ["letter-0", 560], ["letter-1", 520], ["letter-2", 520], ["read-0", 620], ["read-1", 720], ["read-2", 760], ["read-1", 620],
  ]),
  // The letter is put away and her free hand reaches down to pet the dog.
  pet: seq(false, [["stow", 520], ["reach", 1100]]),
  // She picks up her coffee and takes a sip. The last frame stays up.
  coffee: seq(false, [
    ["setdown", 380], ["cup-0", 320], ["cup-1", 340], ["cup-2", 340], ["sip-0", 520], ["sip-1", 1500], ["sip-0", 420], ["cup-2", 900],
  ]),
  // Coffee down, laptop back on her knees.
  resume: seq(false, [
    ["cup-2", 200], ["cup-1", 220], ["cup-0", 220], ["setdown", 260], ["rest", 260], ["aside-1", 220], ["aside-0", 240], ["lift-1", 220], ["lift-0", 200], ["idle-3", 160],
  ]),
};

const dseq = (loop: boolean, frames: [DogFrame, number][]): SpriteSequence => ({ loop, frames: frames.map(([f, ms]) => dog(f, ms)) });

/** The dog. All frames face right; the component mirrors them when the dog runs back. */
export const DOG_ANIMATIONS: Record<DogAnimation, SpriteSequence> = {
  // Waiting beside the postcard: sits and looks up at the visitor, now and then lifts a paw.
  idle: dseq(true, [["sit-0", 2200], ["sit-1", 1300], ["sit-0", 1800], ["paw", 800], ["sit-1", 1400]]),
  look: dseq(false, [["sit-1", 600]]), // head raised, following the airplane
  crouch: dseq(false, [["crouch", 400]]), // gathers itself for the jump
  jump: dseq(false, [["jump", 300]]), // leaves the ground
  catch: dseq(false, [["leap", 600]]), // stretched out at the top of the jump, mouth open for the catch
  run: dseq(true, (["run-0", "run-1", "run-2", "run-3", "run-4"] as DogFrame[]).map((f) => [f, 70] as [DogFrame, number])),
  stand: dseq(false, [["stand", 1000]]), // on all fours, looking up at her
  sit: dseq(false, [["sit-1", 1000]]),
  paw: dseq(false, [["sit-1", 400], ["paw", 1200]]), // being petted
  lie: dseq(false, [["lie", 700], ["doze", 900]]), // lies down at her feet...
  sleep: dseq(true, [["sleep-0", 1700], ["sleep-1", 1700]]), // ...and sleeps, breathing slowly
  wake: dseq(false, [["doze", 450], ["lie", 450], ["sit-0", 350]]),
};

/** Every image the scene uses, for preloading. */
export const ALL_SPRITE_SRCS: string[] = [
  ...new Set([...Object.values(GIRL_ANIMATIONS), ...Object.values(DOG_ANIMATIONS)].flatMap((s) => s.frames.map((f) => f.src))),
  `${ASSET_BASE}/postcard/envelope-front.png`,
];

/** Nose position of the dog frame that a sprite src points at (dog-canvas pixels). */
export function noseForSrc(src: string): readonly [number, number] {
  const name = src.split("/").pop()!.replace(".png", "") as DogFrame;
  return DOG_NOSE[name] ?? DOG_NOSE["stand"];
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

/** Where the dog stands beside the girl, in girl-canvas pixels: its centre is left of her shoes so that her reaching hand is over its head. */
export const DOG_AT_GIRL = { x: 6, feetY: 296 } as const;

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

function build(name: SceneLayout["name"], w: number, h: number, pc: { x: number; y: number; w: number }, girlScale: number, girlAnchorX: number, bagBottom: number, dogRestX: number): SceneLayout {
  const geo = POSTCARD_GEOMETRY[name];
  const unit = pc.w / geo.base;
  const top = bagBottom - GIRL_CANVAS.anchor.y * girlScale;
  const girlLeft = girlAnchorX - GIRL_CANVAS.anchor.x * girlScale; // the beanbag corner stays where the layout puts it, however wide the sprite canvas is
  const dogScale = 0.48 * girlScale; // the dog is drawn at 48% of the girl's scale
  return {
    name,
    w,
    h,
    postcard: { ...pc, h: geo.height * unit, unit },
    closed: { x: pc.x + geo.paper.left * unit, y: pc.y + geo.paper.top * unit, w: geo.paper.width * unit, h: (geo.height - geo.paper.top) * unit },
    girl: { scale: girlScale, left: girlLeft, top },
    dog: { scale: dogScale, restX: dogRestX, feetY: top + DOG_AT_GIRL.feetY * girlScale, stopX: girlLeft + DOG_AT_GIRL.x * girlScale },
    plane: { w: 118 * girlScale, h: 70 * girlScale },
    envelope: { w: 50 * girlScale, h: 33 * girlScale },
  };
}

export const LAYOUTS: Record<SceneLayout["name"], SceneLayout> = {
  // Dog on the left, the postcard in the centre, the girl on the right. The dog runs across in front of the postcard.
  desktop: build("desktop", 1400, 640, { x: 380, y: 28, w: 640 }, 1.12, 1368, 600, 190),
  // Stacked: postcard on top, the dog (left) and the girl (right) share the area below it.
  mobile: build("mobile", 420, 860, { x: 10, y: 0, w: 400 }, 0.9, 389, 832, 58),
};

export const MOBILE_BREAKPOINT = 980; // container width in px below which the stacked layout is used

/** Dog sprite size in design px for a layout. */
export function dogSize(layout: SceneLayout) {
  return { w: DOG_CANVAS.w * layout.dog.scale, h: DOG_CANVAS.h * layout.dog.scale };
}
