"use client";

import { useEffect, useState } from "react";
import type { NavSection } from "@/content/case-studies/sections";

// A floating contents card and a pill showing where you are. On wide screens the card sits in the left margin;
// on narrower ones only the pill shows, and its round button opens the card.
export default function SideNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(`cs-${s.id}`);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections]);

  const behavior = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth") as ScrollBehavior;
  const go = (id: string) => {
    document.getElementById(`cs-${id}`)?.scrollIntoView({ behavior: behavior(), block: "start" });
    setOpen(false);
  };
  const top = () => {
    window.scrollTo({ top: 0, behavior: behavior() });
    setOpen(false);
  };

  return (
    <nav
      aria-label="Case study sections"
      className="fixed bottom-[16px] left-[16px] z-40 flex w-[200px] flex-col gap-[10px] font-body text-[#1f1f1f] max-[560px]:left-1/2 max-[560px]:-translate-x-1/2 min-[1380px]:top-1/2 min-[1380px]:bottom-auto min-[1380px]:-translate-y-1/2"
    >
      <div
        id="cs-nav-card"
        className={`${open ? "block" : "hidden"} rounded-[14px] border border-[#d9d9d9] bg-white px-[18px] pb-[14px] pt-[14px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] min-[1380px]:block`}
      >
        <button type="button" onClick={top} className="cursor-pointer text-[15px] underline underline-offset-2">
          Take me to the top
        </button>
        <ol className="m-0 mt-[12px] flex list-none flex-col gap-[7px] p-0">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => go(s.id)}
                aria-current={i === active ? "true" : undefined}
                className={`flex w-full cursor-pointer gap-[6px] text-left text-[15px] leading-[20px] transition-colors ${i === active ? "font-semibold text-brand" : "text-[#1f1f1f] hover:text-brand"}`}
              >
                <span className="w-[18px] shrink-0 tabular-nums">{i + 1}.</span>
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center gap-[12px] rounded-full bg-[#ececec] p-[5px] pr-[18px] shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          aria-label={open ? "Close section list" : "Open section list"}
          aria-expanded={open}
          aria-controls="cs-nav-card"
          onClick={() => setOpen((o) => !o)}
          className="flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] min-[1380px]:pointer-events-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span className="truncate text-[15px] leading-[18px]" aria-live="polite">
          {sections[active]?.label}
        </span>
      </div>
    </nav>
  );
}
