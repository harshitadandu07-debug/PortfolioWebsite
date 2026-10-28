import Image from "next/image";
import { contact, hero } from "@/content/home";

export default function ContactFooter({ caseStudy = false }: { caseStudy?: boolean }) {
  return (
    <>
      <section id="v2contact" className={`relative z-10 flex flex-col items-center text-center ${caseStudy ? "mt-[121px]" : "mt-[114px]"}`}>
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
      {caseStudy ? (
        <footer className="mt-[19px] h-[43px] w-full overflow-hidden bg-brand">
          <p className="font-script text-[40px] leading-[48px] text-white">Made with &lt;3</p>
        </footer>
      ) : (
        <footer className="relative mt-[14px] min-h-[156px] w-full overflow-hidden bg-brand">
          <Image src="/images/shared/footer-curve.png" alt="" width={4096} height={368} sizes="100vw" className="block h-auto w-full" />
          <p className="absolute -bottom-[5px] left-[max(0px,calc((100%-1200px)/2))] font-script text-[40px] leading-[48px] text-white">Made with &lt;3</p>
        </footer>
      )}
    </>
  );
}
