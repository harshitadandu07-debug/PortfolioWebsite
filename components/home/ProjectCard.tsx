import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/home";

const H = "/images/home/";

function ArrowCircle() {
  return (
    <svg className="absolute right-[34px] top-[44px]" width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <circle cx="15" cy="15" r="13.5" stroke="#fff" strokeWidth="2" />
      <path d="M11 19L19 11M12.5 11H19v6.5" stroke="#fff" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

function Art({ slug }: { slug: string }) {
  switch (slug) {
    case "saciva":
      return (
        <>
          <Image src={`${H}NIorWfMng9wdE4hageXfXG3VM.png`} alt="" width={789} height={455} className="absolute -left-[4px] -top-[22px] h-[455px] w-[789px] max-w-none object-cover" />
          <Image src={`${H}XsDuMOXcAx3p6BRW58yFljob4Q.png`} alt="" width={25} height={34} className="absolute left-[167px] top-[46px] h-[34px] w-[25px] object-contain" />
          <span className="absolute left-[204px] top-[46px] font-urbanist text-[28px] font-bold leading-[33.6px] text-white">Saciva</span>
          <Image src={`${H}OqFArB6HiFpcly8eWQXSZmFbKyc.png`} alt="" width={200} height={319} className="absolute left-[39.5px] top-[273px] h-[319px] w-[200px] max-w-none object-contain [transform:matrix3d(0.957604,-0.274588,-0.0871557,0,0.275637,0.961262,0,0,0.0837795,-0.0240234,0.996195,0,0,0,0,1)]" />
          <Image src={`${H}YeiYRkFPyqmwg9AW1ZFhPTsjEU0.png`} alt="" width={200} height={319} className="absolute left-[220.5px] top-[274.5px] h-[319px] w-[200px] max-w-none object-contain [transform:matrix3d(0.957604,0.274588,0.0871557,0,-0.275637,0.961262,0,0,-0.0837795,-0.0240234,0.996195,0,0,0,0,1)]" />
          <Image src={`${H}5EPe9Ymz7kFmLxR1euecxexaIyU.png`} alt="" width={148} height={304} className="absolute left-[154px] top-[230px] max-w-none object-cover" />
        </>
      );
    case "soldesignsystem":
      return (
        <>
          <Image src={`${H}LFj2Y88u8klJ6kRT5ccFLJm7pmo.png`} alt="" fill sizes="456px" className="object-cover" />
          <Image src={`${H}QN33RjyYyGASjeqnS068vjIRFy8.png`} alt="SoL" width={117} height={78} className="absolute left-[170px] top-[23px] h-[78px] w-[117px] object-contain" />
          <Image src={`${H}VFqvbpOH0KPWDUP5B2kne4s2QA.png`} alt="" width={441} height={319} className="absolute left-[8px] top-[228px] h-[319px] w-[441px] max-w-none object-cover" />
        </>
      );
    case "soakmaster":
      return (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(rgb(18,20,41)_0%,rgb(43,56,98)_26.5537%,rgb(77,89,132)_44.0157%,rgb(157,150,184)_71.1342%,rgb(218,202,228)_87.1094%,rgb(255,255,255)_100%)]" />
          <Image src={`${H}IQuY0NujuiY4MFJBGHezTRyv5m4.png`} alt="HPE" width={82} height={54} className="absolute left-[187px] top-[35px] h-[54px] w-[82px] object-contain" />
          <Image src={`${H}Bnq25M2f7Fv0Js5QSa2IoHOQ.png`} alt="" width={380} height={403} className="absolute left-[37px] top-[214px] h-[403px] w-[380px] max-w-none rounded-[8px] object-cover shadow-[0_1.42px_50px_rgba(97,74,68,0.06)] [transform:matrix3d(0.98095,0,0,0,0,0.980408,0.0332422,-0.0000332422,0,-0.0326089,0.999447,-0.000999447,0,-7.62,0,1)]" />
        </>
      );
    default:
      // Placeholder for the Discovery Education case study.
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Image src={`${H}I9nhZuFalr87B3uYNEP8luTVbHo.png`} alt="Discovery Education" width={190} height={44} className="h-[44px] w-[190px] object-contain" />
        </div>
      );
  }
}

export default function ProjectCard({ project }: { project: Project }) {
  const placeholder = project.slug === "doodlelearning";
  return (
    <Link href={project.href} className="block w-[456px] max-w-full">
      <div className="relative h-[433px] overflow-hidden rounded-[8px]">
        <Art slug={project.slug} />
        {!placeholder && <ArrowCircle />}
      </div>
      <p className="mt-[24px] font-body text-[20px] font-semibold leading-[24px]">{project.title}</p>
      <p
        className={`mt-[24px] overflow-hidden whitespace-nowrap text-[18px] leading-[21.6px] text-muted ${project.tagFont === "apfel" ? "font-apfel" : "font-body"}`}
      >
        {project.tags.map((t, i) => (
          <span key={t}>
            {i > 0 && <strong className="whitespace-pre font-bold">{" • "}</strong>}
            {t}
          </span>
        ))}
      </p>
    </Link>
  );
}
