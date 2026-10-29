import Image from "next/image";
import { hero } from "@/content/home";
import Camera from "./Camera";
import PaintBrushes from "./PaintBrushes";

const infoRow = "flex items-center gap-[4px] font-graphik text-[15px] leading-[normal] text-muted";

// Laid out from the Figma hero: a centred column of text with the desk objects scattered to its right.
export default function Hero() {
  return (
    <section className="relative mx-auto h-[max(620px,calc(100svh-125px))] w-full max-w-[1200px]">
      <div className="absolute left-[200px] top-[210px] w-[580px]">
        <h1 className="font-display text-[86px] font-medium leading-[1.1] text-brand">{hero.title}</h1>
        <p className="mt-[2px] font-display text-[33px] font-normal leading-[1.14]">{hero.tagline}</p>
        <p className="mt-[18px] font-graphik text-[17px] leading-[normal]">
          <a href={hero.linkedin} className="text-muted underline">{hero.talkLink}</a>
          {hero.talkRest}
        </p>
      </div>

      <div className="absolute left-[200px] top-[480px] flex flex-col gap-[12px]">
        <div className={infoRow}>
          <Image src="/icons/icon-grad.svg" alt="" width={16} height={13} className="h-auto w-[14px]" />
          <span>{hero.school}</span>
        </div>
        <div className={infoRow}>
          <Image src="/icons/icon-laptop.svg" alt="" width={16} height={13} className="h-auto w-[14px]" />
          <span>{hero.current}</span>
          <Image src="/images/home/hero/de-logo.png" alt="Discovery Education" width={95} height={22} className="ht-invert ml-[4px] h-auto w-[80px]" />
        </div>
        <div className={infoRow}>
          <Image src="/icons/icon-pencil.svg" alt="" width={16} height={13} className="h-auto w-[14px]" />
          <span>{hero.prev}</span>
        </div>
      </div>

      <div className="absolute left-[850px] top-[410px] rotate-[12deg]">
        <PaintBrushes />
      </div>
      <Camera className="absolute left-[965px] top-[312px] z-10" />
      <Image src="/images/home/hero/mixtape.png" alt="" width={432} height={324} className="absolute left-[950px] top-[455px] w-[150px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" draggable={false} />
    </section>
  );
}
