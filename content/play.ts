// The Garden (Play) page, as on the current site: a ring of pieces that turns as you scroll, then three captioned projects.
export type Media = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  width: number;
  height: number;
};

export const garden = {
  title: "Garden",
  hint: "Scroll for more",
  intro: "A space for half-built ideas, playful detours, past explorations, and concepts that still have something to say…",
};

/** The pieces on the ring, in clockwise order starting from the top. */
export const ring: Media[] = [
  { kind: "image", src: "/images/play/crystal-head.webp", alt: "A glossy bust with crystals growing out of its head", width: 1200, height: 1500 },
  { kind: "image", src: "/images/play/portrait-split.webp", alt: "Portrait split between a face and a bloom of pink petals", width: 1093, height: 1365 },
  { kind: "image", src: "/images/play/beyond-the-skin.webp", alt: "Poster titled Beyond the Skin", width: 1200, height: 1500 },
  { kind: "image", src: "/images/play/amazon-music.webp", alt: "Amazon Music screens on two phones", width: 1200, height: 1394 },
  { kind: "image", src: "/images/play/planta.webp", alt: "Planta design critique cover", width: 1081, height: 1402 },
  { kind: "video", src: "/videos/play/stylecast.mp4", poster: "/videos/play/stylecast.jpg", alt: "Screen recording of an AR fashion try-on", width: 540, height: 910 },
  { kind: "image", src: "/images/play/lapse.webp", alt: "Cover of Lapse, a heuristic evaluation report", width: 603, height: 850 },
  { kind: "video", src: "/videos/play/route-ar.mp4", poster: "/videos/play/route-ar.jpg", alt: "A phone showing an AR walking-route suggestion", width: 540, height: 960 },
];

export type GalleryItem = { media: Media; caption?: string };

/** The grid under the ring. Only the pieces that have a caption on the current site show one. */
export const gallery: GalleryItem[] = [
  { media: ring[7], caption: "AR city exploration concept - UXA-Thon Winning Project" },
  { media: ring[2] },
  { media: { kind: "image", src: "/images/play/askmta.webp", alt: "AskMta service alert screens on two tablets", width: 1200, height: 1312 }, caption: "AskMta: An Ethnographic Study for Toyota Group" },
  { media: ring[5], caption: "AR Fashion Tryon" },
  { media: ring[0] },
  { media: ring[3] },
  { media: ring[1] },
  { media: ring[4] },
  { media: ring[6] },
];
