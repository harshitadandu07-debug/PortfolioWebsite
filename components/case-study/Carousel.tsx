"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Slide = { src: string; w: number; h: number; radius: string; pos?: string };

export default function Carousel({ slides, pill }: { slides: Slide[]; pill?: boolean }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((n) => (n + d + slides.length) % slides.length);
  const s = slides[i];
  const btn =
    "absolute top-[245px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black/65 text-white";
  return (
    <div className="relative overflow-hidden" style={{ width: s.w, height: s.h, borderRadius: s.radius }}>
      <AnimatePresence initial={false}>
        <motion.div
          key={s.src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image src={s.src} alt="" width={s.w} height={s.h} className="h-full w-full object-cover" style={{ objectPosition: s.pos }} />
        </motion.div>
      </AnimatePresence>
      <button type="button" aria-label="Previous slide" onClick={() => go(-1)} className={`${btn} left-[20px]`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <button type="button" aria-label="Next slide" onClick={() => go(1)} className={`${btn} right-[20px]`}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <div className={`absolute left-1/2 flex -translate-x-1/2 gap-[6px] ${pill ? "bottom-[8px] h-[30px] items-center rounded-full bg-black/65 px-[12px]" : "bottom-[10px]"}`}>
        {slides.map((_, j) => (
          <button key={j} type="button" aria-label={`Slide ${j + 1}`} onClick={() => setI(j)} className={`h-[6px] w-[6px] rounded-full ${j === i ? "bg-white" : "bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}
