import Image from "next/image";
import Link from "next/link";
import type { Block, CanvasChild } from "@/content/case-studies/types";
import RichText from "./RichText";
import Carousel from "./Carousel";
import { toCss } from "./textStyle";

function Child({ c }: { c: CanvasChild }) {
  const pos = { left: c.x, top: c.y, width: c.w, height: c.h } as const;
  switch (c.type) {
    case "text":
      return (
        <RichText
          html={c.html}
          style={c.style}
          className="absolute m-0"
          extra={{ left: c.x, top: c.y, width: c.w, whiteSpace: c.h <= (c.style.lineHeight ?? c.style.fontSize * 1.2) * 1.5 ? "nowrap" : undefined }}
        />
      );
    case "img":
      return (
        <Image
          src={c.src}
          alt={c.alt}
          width={c.w}
          height={c.h}
          sizes={`${c.w}px`}
          className="absolute max-w-none"
          style={{ ...pos, objectFit: c.fit as "cover", borderRadius: c.radius, transform: c.transform ?? undefined }}
        />
      );
    case "video":
      // TODO(Harshita): videos are placeholders for now. When you send the files, drop them in
      // public/videos/case-studies/<slug>/ and swap this block for the <video> below (c.src already
      // points at the expected filename, e.g. /videos/case-studies/soldesignsystem/video-01.mp4):
      //   <video src={c.src} autoPlay loop muted playsInline className="absolute max-w-none"
      //          style={{ ...pos, objectFit: c.fit, borderRadius: c.radius }} />
      return (
        <div
          role="img"
          aria-label="Video placeholder"
          className="absolute flex items-center justify-center bg-[#ececec] font-body text-[14px] text-[#8a8a8a]"
          style={{ ...pos, borderRadius: c.radius }}
        >
          Video placeholder
        </div>
      );
    case "box":
      return (
        <div
          className="absolute"
          style={{
            ...pos,
            background: c.gradient ?? c.bg ?? undefined,
            borderRadius: c.radius,
            border: c.border ?? undefined,
            boxShadow: c.shadow ?? undefined,
          }}
        />
      );
  }
}

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
                style={{ ...mt, ...toCss(b.style), marginLeft: b.x, width: b.w, paddingLeft: 0, listStylePosition: "outside" }}
              >
                {b.items.map((h, j) => (
                  <li key={j} className="pl-0" dangerouslySetInnerHTML={{ __html: h }} />
                ))}
              </Tag>
            );
          }
          case "canvas":
            return (
              <div key={i} className="relative" style={{ ...mt, height: b.h }}>
                {b.children.map((c, j) => (
                  <Child key={j} c={c} />
                ))}
              </div>
            );
          case "carousel":
            return (
              <div key={i} style={mt}>
                <Carousel slides={b.slides} />
              </div>
            );
        }
      })}
    </>
  );
}
