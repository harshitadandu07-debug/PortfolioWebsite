import Link from "next/link";
import type { Block } from "@/content/case-studies/types";
import RichText from "./RichText";
import Carousel from "./Carousel";
import BeforeAfter from "./BeforeAfter";
import { Child } from "./CanvasChildView";
import { toCss } from "./textStyle";

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        const mt = { marginTop: b.gap };
        switch (b.kind) {
          case "text": {
            const oneLine = b.h <= (b.style.lineHeight ?? b.style.fontSize * 1.2) * 1.5;
            const p = <RichText html={b.html} style={b.style} extra={{ marginLeft: b.x, width: b.w, whiteSpace: oneLine ? "nowrap" : undefined }} className="m-0" />;
            return (
              <div key={i} style={mt}>
                {b.href ? <Link href={b.href}>{p}</Link> : p}
              </div>
            );
          }
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag
                key={i}
                className={`m-0 p-0 ${b.ordered ? "list-decimal" : "list-disc"}`}
                style={{ ...mt, ...toCss(b.style), marginLeft: b.x, width: b.w, paddingLeft: b.indent ?? 0, listStylePosition: "outside" }}
              >
                {b.items.map((h, j) => (
                  <li key={j} className="pl-0" dangerouslySetInnerHTML={{ __html: h }} />
                ))}
              </Tag>
            );
          }
          case "canvas":
            return (
              <div key={i} id={b.id} className="relative" style={{ ...mt, height: b.h }}>
                {b.children.map((c, j) => (
                  <Child key={j} c={c} />
                ))}
              </div>
            );
          case "toggle":
            return (
              <div key={i} style={mt}>
                <BeforeAfter block={b} />
              </div>
            );
          case "carousel":
            return (
              <div key={i} style={mt}>
                <Carousel slides={b.slides} pill={b.pill} />
              </div>
            );
        }
      })}
    </>
  );
}
