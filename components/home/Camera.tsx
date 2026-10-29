"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";

const photos = [
  { src: "/images/home/hero/polaroid-nyc.jpg", caption: "Based in NYC", y: 95, x: -15, rotate: -2.85, top: 6 },
  { src: "/images/home/hero/polaroid-pratt.jpg", caption: "MSHCI'27 @Pratt", y: 110, x: 35, rotate: 3, top: 4 },
];

// The camera picture. Clicking ejects up to two photos from behind it.
export default function Camera({ className = "" }: { className?: string }) {
  const [ejected, setEjected] = useState(0);
  return (
    <button
      type="button"
      aria-label="Eject a photo"
      onClick={() => setEjected((n) => Math.min(n + 1, photos.length))}
      className={`${className} h-[112px] w-[165px] -rotate-[11deg] cursor-pointer`}
    >
      {photos.map((p, i) => (
        <motion.div
          key={p.caption}
          className="absolute left-[30px] top-[0px] h-[142px] w-[105px] rounded-[4px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
          style={{ zIndex: i }}
          initial={false}
          animate={{ x: ejected > i ? p.x : 0, y: ejected > i ? p.y : 0, rotate: ejected > i ? p.rotate : 0, opacity: ejected > i ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="absolute left-[6px] top-[6px] h-[108px] w-[89px] rounded-[2px] bg-cover bg-center" style={{ backgroundImage: `url(${p.src})` }} />
          <p className="absolute inset-x-0 top-[118px] text-center font-graphik text-[8px] leading-[10px] text-[#333]">{p.caption}</p>
        </motion.div>
      ))}
      <Image src="/images/home/hero/camera.png" alt="" width={546} height={370} priority draggable={false} className="absolute inset-0 z-10 h-full w-full drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" />
    </button>
  );
}
