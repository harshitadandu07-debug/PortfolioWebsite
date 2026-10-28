import Image from "next/image";
import { hero } from "@/content/home";
import Camera from "./Camera";

const infoRow = "flex items-center gap-[12px] font-body text-[18px] leading-[21.6px] text-muted";

export default function Hero() {
  return (
    <section className="relative mx-auto h-[740px] w-full max-w-[1200px]">
      <div className="absolute left-[69px] top-[208px]">
        <h1 className="font-display text-[80px] font-medium leading-[96px] text-brand">{hero.title}</h1>
        <p className="mt-0 w-[504px] font-body text-[27px] font-medium leading-[35.1px]">{hero.tagline}</p>
        <p className="mt-[16px] font-body text-[16px] leading-[19.2px]">
          <a href={hero.linkedin} className="text-muted underline">{hero.talkLink}</a>
          {hero.talkRest}
        </p>
      </div>

      <div className="absolute left-[69px] top-[577px] flex flex-col gap-[16px]">
        <div className={infoRow}>
          <Image src="/icons/icon-grad.svg" alt="" width={23} height={19} className="h-auto w-[23px]" />
          <span>{hero.school}</span>
        </div>
        <div className={infoRow}>
          <Image src="/icons/icon-laptop.svg" alt="" width={23} height={18} />
          <span>{hero.current}</span>
          <Image src="/images/shared/logo-discovery-education.png" alt="Discovery Education" width={95} height={22} />
        </div>
        <div className={infoRow}>
          <Image src="/icons/icon-pencil.svg" alt="" width={23} height={18} />
          <span>{hero.prev}</span>
        </div>
      </div>

      <Image src="/images/home/hero/brushes.png" alt="" width={126} height={163} className="absolute left-[713px] top-[208px]" priority />
      <Image src="/images/home/hero/tablet-avatar.png" alt="" width={221} height={175} className="absolute left-[901px] top-[306px] rotate-[18deg]" priority />
      <Image src="/images/home/hero/cookie.png" alt="" width={172} height={165} className="absolute left-[951px] top-[513px]" />
      <Camera className="absolute left-[687px] top-[409px]" />
    </section>
  );
}
