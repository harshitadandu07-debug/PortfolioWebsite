import Image from "next/image";
import type { CanvasChild } from "@/content/case-studies/types";
import RichText from "./RichText";

export function Child({ c }: { c: CanvasChild }) {
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
          style={{ ...pos, objectFit: c.fit as "cover", objectPosition: c.pos, borderRadius: c.radius, transform: c.transform ?? undefined }}
        />
      );
    case "video":
      if (c.ready)
        return (
          <video
            src={c.src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute max-w-none"
            style={{ ...pos, objectFit: c.fit as "cover", borderRadius: c.radius }}
          />
        );
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
    case "group":
      return (
        <div className={`absolute ${c.clip ? "overflow-hidden" : ""}`} style={{ ...pos, borderRadius: c.radius, transform: c.transform ?? undefined }}>
          {c.children.map((k, j) => (
            <Child key={j} c={k} />
          ))}
        </div>
      );
    case "box": {
      const Tag = c.href ? "a" : "div";
      return (
        <Tag
          {...(c.href ? { href: c.href } : {})}
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
}
