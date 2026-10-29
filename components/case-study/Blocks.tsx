import Link from "next/link";
import type { Block } from "@/content/case-studies/types";
import RichText from "./RichText";
import Carousel from "./Carousel";
import BeforeAfter from "./BeforeAfter";
import { Child } from "./CanvasChildView";
import { toCss } from "./textStyle";

// Zero-size marks at the top of a block: where the side navigation scrolls to and measures from.
const Anchors = ({ ids }: { ids?: string[] }) => (
  <>
    {ids?.map((id) => (
      <span key={id} id={`cs-${id}`} aria-hidden className="pointer-events-none absolute left-0 h-0 w-0" style={{ top: -56 }} />
    ))}
  </>
);

export default function Blocks({ blocks, anchors = {} }: { blocks: Block[]; anchors?: Record<number, string[]> }) {
  return (
    <>
      {blocks.map((b, i) => {
        const mt = { marginTop: b.gap };
        const a = <Anchors ids={anchors[i]} />;
        switch (b.kind) {
          case "text": {
            const oneLine = b.h <= (b.style.lineHeight ?? b.style.fontSize * 1.2) * 1.5;
            const p = <RichText html={b.html} style={b.style} extra={{ marginLeft: b.x, width: b.w, whiteSpace: oneLine ? "nowrap" : undefined }} className="m-0" />;
            return (
              <div key={i} className="relative" style={mt}>
                {a}
                {b.href ? <Link href={b.href}>{p}</Link> : p}
              </div>
            );
          }
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag
                key={i}
                className={`relative m-0 p-0 ${b.ordered ? "list-decimal" : "list-disc"}`}
                style={{ ...mt, ...toCss(b.style), marginLeft: b.x, width: b.w, paddingLeft: b.indent ?? 0, listStylePosition: "outside" }}
              >
                {anchors[i] && a}
                {b.items.map((h, j) => (
                  <li key={j} className="pl-0" dangerouslySetInnerHTML={{ __html: h }} />
                ))}
              </Tag>
            );
          }
          case "canvas":
            return (
              <div key={i} id={b.id} className="relative" style={{ ...mt, height: b.h }}>
                {a}
                {b.children.map((c, j) => (
                  <Child key={j} c={c} />
                ))}
              </div>
            );
          case "toggle":
            return (
              <div key={i} className="relative" style={mt}>
                {a}
                <BeforeAfter block={b} />
              </div>
            );
          case "carousel":
            return (
              <div key={i} className="relative" style={mt}>
                {a}
                <Carousel slides={b.slides} pill={b.pill} />
              </div>
            );
        }
      })}
    </>
  );
}
