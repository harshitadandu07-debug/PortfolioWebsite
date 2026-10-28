export type TextStyle = {
  fontSize: number;
  fontWeight: number;
  color: string;
  lineHeight?: number;
  textAlign?: "center" | "right";
  letterSpacing?: number;
  textTransform?: string;
  fontStyle?: "italic";
  font: "raleway" | "instrument" | "display";
};

export type CanvasChild =
  | { type: "text"; x: number; y: number; w: number; h: number; html: string; style: TextStyle }
  | { type: "img"; x: number; y: number; w: number; h: number; src: string; alt: string; fit: string; pos?: string; radius: string; transform: string | null }
  | { type: "video"; x: number; y: number; w: number; h: number; src: string; fit: string; radius: string; ready?: boolean }
  | { type: "group"; x: number; y: number; w: number; h: number; radius: string; transform?: string | null; clip?: boolean; children: CanvasChild[] }
  | { type: "box"; x: number; y: number; w: number; h: number; bg: string | null; gradient: string | null; radius: string; border: string | null; shadow: string | null; href?: string };

export type ToggleState = {
  trackBg: string;
  thumbX: number;
  labelStyles: [TextStyle, TextStyle];
  children: CanvasChild[];
};

export type Block =
  | { kind: "text"; gap: number; x: number; w: number; h: number; html: string; style: TextStyle; href: string | null }
  | { kind: "list"; gap: number; x: number; w: number; indent?: number; ordered: boolean; items: string[]; style: TextStyle }
  | { kind: "canvas"; id?: string; gap: number; h: number; children: CanvasChild[] }
  | {
      kind: "toggle";
      gap: number;
      h: number;
      labels: [{ x: number; y: number; w: number; h: number; html: string }, { x: number; y: number; w: number; h: number; html: string }];
      track: { x: number; y: number; w: number; h: number; radius: string };
      thumb: { y: number; w: number; h: number; radius: string; bg: string | null };
      states: { before: ToggleState; after: ToggleState };
    }
  | { kind: "carousel"; gap: number; h: number; pill?: boolean; slides: { src: string; w: number; h: number; radius: string; pos?: string }[] };

export type CaseStudyData = {
  slug: string;
  hero: { h: number; gradient?: string | null; layers: { src: string; x: number; y: number; w: number; h: number; fit: string; transform: string | null }[] } | null;
  startGap: number;
  blocks: Block[];
  next: {
    heading: string;
    headingStyle: TextStyle;
    headingH: number;
    image: string | null;
    imageSize: [number, number] | null;
    imageGap: number;
    title: string;
    titleStyle: TextStyle | null;
    titleGap: number;
    tags: string;
    tagsStyle: TextStyle | null;
    tagsGap: number;
    gapBefore: number;
  };
};
