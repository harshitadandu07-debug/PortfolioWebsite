"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Work", href: "/#work" },
  { label: "About(me)", href: "/aboutpage" },
  { label: "Play", href: "/play" },
  { label: "Contact", href: "/#v2contact" },
];

const CASE_STUDIES = ["/saciva", "/soldesignsystem", "/soakmaster", "/doodlelearning"];

export default function Nav() {
  const pathname = usePathname();
  const smart = CASE_STUDIES.includes(pathname);
  const [visible, setVisible] = useState(true);

  // Case-study pages hide the nav while scrolling down and bring it back on scroll up.
  useEffect(() => {
    if (!smart) {
      setVisible(true);
      return;
    }
    setVisible(false);
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 4) return;
      setVisible(y < last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [smart]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-30 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="mx-auto flex h-[56px] w-full max-w-[1200px] items-start justify-between px-5 pt-3 min-[1200px]:px-0">
        <Link href="/" aria-label="Home">
          <Image src="/icons/logo.svg" alt="" width={31} height={33} priority />
        </Link>
        <nav className="flex gap-6 pt-[5px] font-display text-[20px] leading-6 min-[600px]:gap-12">
          {links.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
