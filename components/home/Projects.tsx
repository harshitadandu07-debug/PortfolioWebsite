import Image from "next/image";
import { filters, projects } from "@/content/home";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="work" className="mx-auto mt-[46px] w-full max-w-[1200px]">
      <div className="relative flex items-center justify-between px-[126px]">
        <div className="flex items-center gap-[12px]">
          <Image src="/icons/icon-arrow-down.svg" alt="" width={23} height={30} />
          <h2 className="font-display text-[32px] font-medium leading-[38.4px]">Selected Projects</h2>
        </div>
        <ul className="flex gap-[31px]">
          {filters.map((f) => (
            <li key={f} className="flex h-[28px] w-[135px] items-center justify-center rounded-[14px] border border-muted/60 font-apfel text-[14px] leading-[16.8px] tracking-[0.28px] text-muted">
              {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-[124px] grid w-[960px] grid-cols-2 gap-x-[48px] gap-y-[48px] pb-[0px]">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
