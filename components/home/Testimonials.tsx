import Image from "next/image";
import { testimonials } from "@/content/home";

export default function Testimonials() {
  return (
    <section className="mx-auto mt-[143px] w-full max-w-[1200px]">
      <div className="flex items-center justify-between px-[120px]">
        <div className="flex items-center gap-[12px]">
          <Image src="/icons/icon-arrow-down.svg" alt="" width={23} height={30} />
          <h2 className="font-display text-[32px] font-medium leading-[38.4px]">Testimonials</h2>
        </div>
        <p className="font-graphik text-[14px] tracking-[0.28px] text-muted">I didn&apos;t come up with these, I swear!</p>
      </div>
      <div className="mt-[103px] flex justify-center gap-[20px]">
        {testimonials.map((t) => (
          <figure key={t.name} className="ht-card relative h-[359px] w-[330px] rounded-[8px] bg-[#e3f2ff] shadow-[0_1px_2px_rgba(85,85,85,0.25)]">
            <div className="ht-card-inner absolute left-[11px] top-[12px] h-[333px] w-[309px] bg-white">
              <Image src="/icons/icon-blob.svg" alt="" width={55} height={43} className="absolute right-[10px] top-[8px]" />
              <figcaption className="absolute left-[27px] top-[40px] font-graphik text-brand">
                <p className={`text-[20px] leading-[24px] ${t.nameWeight === "bold" ? "font-bold" : "font-semibold"}`}>{t.name}</p>
                <p className="mt-[4px] text-[16px] leading-[19.2px]">{t.role}</p>
              </figcaption>
              <blockquote
                className="absolute left-[27px] top-[132px] w-[257px] font-graphik leading-[1.2]"
                style={{ fontSize: t.size }}
              >
                {t.quote.map((q, i) =>
                  typeof q === "string" ? (
                    <span key={i}>{q}</span>
                  ) : (
                    <strong key={i} className="font-bold text-brand">{q[0]}</strong>
                  ),
                )}
              </blockquote>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
