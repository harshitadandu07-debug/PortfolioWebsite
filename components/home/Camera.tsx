"use client";

import { useState } from "react";
import { motion } from "motion/react";

const photos = [
  { src: "/images/home/hero/polaroid-nyc.jpg", caption: "Based in NYC", y: 133, rotate: -2.85, top: 6 },
  { src: "/images/home/hero/polaroid-pratt.jpg", caption: "MSHCI'27 @Pratt", y: 162, rotate: 3, top: 4 },
];

// CSS-built camera mirrored from the original's div illustration. Clicking ejects up to two photos.
export default function Camera({ className = "" }: { className?: string }) {
  const [ejected, setEjected] = useState(0);
  return (
    <button
      type="button"
      aria-label="Eject a photo"
      onClick={() => setEjected((n) => Math.min(n + 1, photos.length))}
      className={`${className} h-[120px] w-[128px] -rotate-12 cursor-pointer`}
    >
      {photos.map((p, i) => (
        <motion.div
          key={p.caption}
          className="absolute left-[11px] top-[10px] h-[142px] w-[105px] rounded-[4px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
          style={{ zIndex: i }}
          initial={false}
          animate={{ y: ejected > i ? p.y : 0, rotate: ejected > i ? p.rotate : 0, opacity: ejected > i ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="absolute left-[6px] top-[6px] h-[108px] w-[89px] rounded-[2px] bg-cover bg-center" style={{ backgroundImage: `url(${p.src})` }} />
          <p className="absolute inset-x-0 top-[118px] text-center font-graphik text-[8px] leading-[10px] text-[#333]">{p.caption}</p>
        </motion.div>
      ))}
      <span className="absolute inset-0 z-10 block">
        <span className="absolute inset-0 rounded-[20px] bg-[#e3e2d8] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.2),0_10px_15px_-3px_rgba(0,0,0,0.15)]" />
        <span className="absolute left-[10px] top-[22px] h-[30px] w-[28px] rounded-[8px] bg-[#2a2a2a] bg-[repeating-linear-gradient(#1a1a1a_0_4px,#2a2a2a_4px_8px)]" />
        <span className="absolute left-[40px] top-[10px] h-[54px] w-[54px] rounded-full bg-[#2a2a2a] shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <span className="absolute inset-[2px] rounded-full bg-[#e8e8e8]" />
          <span className="absolute inset-[7px] rounded-full bg-[#2a2a2a]" />
          <span className="absolute inset-[10px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#3a4a5a_0%,#1a1a1a_40%,#0a0a0a_100%)] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
        </span>
        <span className="absolute left-[100px] top-[14px] h-[30px] w-[24px] rounded-[9px] bg-[#2a2a2a]">
          <span className="absolute left-[3px] top-[5px] h-[18px] w-[18px] rounded-full border-[3px] border-[#2a2a2a] bg-[#0a0a0a]" />
        </span>
        <span className="absolute left-[10px] top-[66px] h-[20px] w-[20px] rounded-full border-2 border-white/20 bg-[#ff7043]" />
        <span className="absolute left-[58px] top-[72px] h-[9px] w-[9px] bg-[linear-gradient(#e53935_0_33%,#ffb300_33%_66%,#fb8c00_66%)]" />
        <span className="absolute left-[106px] top-[72px] h-[4px] w-[10px] rounded-full bg-[#1a1a1a]" />
        <span className="absolute left-0 top-[88px] h-[32px] w-[128px] rounded-[6px_6px_20px_20px] bg-[#eceae0]" />
        <span className="absolute left-[14px] top-[98px] h-[14px] w-[100px] rounded-[3px] bg-[#0a0a0a]" />
      </span>
    </button>
  );
}
