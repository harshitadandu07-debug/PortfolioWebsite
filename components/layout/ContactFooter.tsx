import Image from "next/image";
import { contact, hero } from "@/content/home";

// The case-study footer. The home page has its own scroll-driven one in HomeFooter.
export default function ContactFooter() {
  return (
    <>
      <section id="v2contact" className="relative z-10 mt-[121px] flex flex-col items-center text-center">
        <h2 className="font-display text-[80px] font-medium leading-[96px] text-brand">{contact.title}</h2>
        <p className="mt-[12px] font-display text-[32px] leading-[38.4px]">{contact.subtitle}</p>
        <div className="mt-[12px] flex gap-[24px]">
          <a href={hero.linkedin} aria-label="LinkedIn">
            <Image src="/images/shared/icon-linkedin.png" alt="" width={58} height={58} />
          </a>
          <a href={hero.email} aria-label="Email">
            <Image src="/images/shared/icon-email.png" alt="" width={58} height={58} />
          </a>
        </div>
      </section>
      <footer className="mt-[19px] h-[43px] w-full overflow-hidden bg-brand">
        <p className="font-script text-[40px] leading-[48px] text-white">Made with &lt;3</p>
      </footer>
    </>
  );
}
