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
  | { type: "img"; x: number; y: number; w: number; h: number; src: string; alt: string; fit: string; radius: string; transform: string | null }
  | { type: "video"; x: number; y: number; w: number; h: number; src: string; fit: string; radius: string }
  | { type: "box"; x: number; y: number; w: number; h: number; bg: string | null; gradient: string | null; radius: string; border: string | null; shadow: string | null };

export type Block =
  | { kind: "text"; gap: number; x: number; w: number; h: number; html: string; style: TextStyle; href: string | null }
  | { kind: "list"; gap: number; x: number; w: number; ordered: boolean; items: string[]; style: TextStyle }
  | { kind: "canvas"; gap: number; h: number; children: CanvasChild[] }
  | { kind: "carousel"; gap: number; h: number; slides: { src: string; w: number; h: number; radius: string }[] };

export type CaseStudyData = {
  slug: string;
  hero: { h: number; layers: { src: string; x: number; y: number; w: number; h: number; fit: string; transform: string | null }[] } | null;
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
