import Image from "next/image";
import Link from "next/link";
import type { CaseStudyData } from "@/content/case-studies/types";
import ContactFooter from "@/components/layout/ContactFooter";
import { caseStudySections } from "@/content/case-studies/sections";
import Blocks from "./Blocks";
import SideNav from "./SideNav";
import RichText from "./RichText";

export default function CaseStudyPage({ data, nextHref }: { data: CaseStudyData; nextHref: string }) {
  const { hero, next } = data;
  const sections = caseStudySections[data.slug] ?? [];
  const anchors: Record<number, string[]> = {};
  sections.forEach((s) => (anchors[s.block] ??= []).push(s.id));
  return (
    <main className="bg-white">
      {sections.length > 0 && <SideNav sections={sections} />}
      {hero && (
        <section className="relative w-full overflow-hidden" style={{ height: hero.h, background: hero.gradient ?? undefined }}>
          {hero.layers.map((l, i) =>
            l.w > 1400 ? (
              <Image key={i} src={l.src} alt="" fill sizes="100vw" priority className="object-cover" />
            ) : (
              <Image
                key={i}
                src={l.src}
                alt=""
                width={l.w}
                height={l.h}
                priority
                className="absolute left-1/2 max-w-none -translate-x-1/2"
                style={{ top: l.y, width: l.w, height: l.h }}
              />
            ),
          )}
        </section>
      )}
      <div className="mx-auto w-[1008px]" style={{ paddingTop: data.startGap }}>
        <Blocks blocks={data.blocks} anchors={anchors} />
      </div>
      <section className="mx-auto flex flex-col items-center" style={{ marginTop: next.gapBefore }}>
        <RichText html={next.heading} style={next.headingStyle} className="m-0 text-center" />
        {next.image && next.imageSize && (
          <Link href={nextHref} className="block" style={{ marginTop: next.imageGap, width: next.imageSize[0] }}>
            <Image src={next.image} alt="" width={next.imageSize[0]} height={next.imageSize[1]} className="block" />
            {next.titleStyle && <RichText html={next.title} style={next.titleStyle} className="m-0" extra={{ marginTop: next.titleGap }} />}
            {next.tagsStyle && <RichText html={next.tags} style={next.tagsStyle} className="m-0" extra={{ marginTop: next.tagsGap }} />}
          </Link>
        )}
      </section>
      <ContactFooter />
    </main>
  );
}
